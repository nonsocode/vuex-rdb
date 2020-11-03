import { hasSeen, identity, isFunction } from './utils';
import { Actions, FindOptions, Getters, IModel, IModelStatic, Mutations, Relationship } from './types';
import { Store } from 'vuex';
import { getRelationshipSchema } from './relationships';
import { FieldDefinition } from './FieldDefinition';
import { getConstructor, normalizeAndStore, validateEntry } from './modelUtils';
import Vue from 'vue';
import { ModelArray } from './modelArray';

const cacheNames = ['data', 'relationship'];

function ModelDecorator<T extends IModelStatic<any>>(constructor: T) {
  return constructor;
}
const getCacheName = isRelationship => cacheNames[isRelationship ? 1 : 0];
const parseIfLiteral = (id: any, Schema: typeof Model): any => {
  return ['string', 'number'].includes(typeof id) ? Schema.find(id) : id;
};
const proxySetter = (target: Model<any>, key: string, value) => {
  if (!(key in target)) {
    createAccessor(target, key);
  }
  target[key] = value;
  return true;
};
function cacheDefaults(model: Model<any>, overrides = {}) {
  Object.entries(getConstructor(model)._fields).forEach(([key, definition]) => {
    model._caches[getCacheName(definition.isRelationship)][key] = overrides[key] ?? definition.default;
  });
}

function createAccessor(target: Model<any>, key) {
  const Schema = getConstructor(target);
  const { _namespace: path, _store, _fields, id } = Schema;
  const isRelationship = key in _fields && _fields[key].isRelationship;
  const relationshipDef = isRelationship ? _fields[key] : null;

  Object.defineProperty(target, key, {
    enumerable: true,
    get() {
      if (target._connected) {
        const raw: any = _store.getters[`${path}/${Getters.GET_RAW}`](this._id, Schema);
        const value = raw[key];
        if (isRelationship) {
          const opts = { load: target._load?.[key] };
          const Related = getRelationshipSchema(relationshipDef);
          if (relationshipDef.isList) {
            return value && new ModelArray(target, key, Related.findByIds<any>(value, opts));
          }
          return Related.find(value, opts);
        } else {
          return raw[key];
        }
      }
      return this._caches[getCacheName(isRelationship)][key];
    },
    set(value) {
      if (value != null) {
        if (isRelationship) {
          const Related = getRelationshipSchema(relationshipDef);
          value = parseIfLiteral(value, Related);
          if (relationshipDef.isList) {
            value = Array.isArray(value) ? value : [value].filter(identity);
          }
          if (target._connected) {
            if (!validateEntry(value, relationshipDef)) {
              throw new Error(`An item being assigned to the property [${key}] does not have a valid identifier`);
            }
            value = normalizeAndStore(_store, value, relationshipDef.entity);
          }
        } else if (target._connected && (isFunction(id) || id == key)) {
          const oldId = getIdValue(target, Schema);
          const newId = getIdValue({ ...target, [key]: value }, Schema);
          if (oldId != newId) {
            throw new Error('This update is not allowed becasue the resolved id is different from the orginal value');
          }
        }
      }

      target._connected
        ? _store.commit(`${path}/${Mutations.SET_PROP}`, { id: this._id, key, value, schema: Schema })
        : Vue.set(this._caches[getCacheName(isRelationship)], key, value);
    }
  });
}

export function getIdValue<T>(model: T, schema: typeof Model): string | number {
  return isFunction(schema.id) ? schema.id(model, null, null) : model[schema.id as string];
}

@ModelDecorator
export class Model<T extends any> implements IModel {
  public static _namespace: string;
  public static entityName: string;
  public static _store: Store<any>;
  public static _fields: Record<string, FieldDefinition>;
  static id: string | ((...args: any[]) => string | number) = 'id';

  _load;
  _caches;
  _connected = false;
  _id;

  constructor(data?: Partial<T>, opts: any = {}) {
    const id = data ? getIdValue(data, getConstructor(this)) : null;
    Object.defineProperties(this, {
      _caches: { value: Object.fromEntries(cacheNames.map(name => [name, {}])) },
      _connected: { value: !!opts?.connected, enumerable: false, configurable: true },
      _load: { value: opts?.load, enumerable: false, configurable: true },
      _id: { value: id, enumerable: false, configurable: false, writable: true }
    });

    const { _fields } = getConstructor(this);
    Object.keys(_fields).forEach(key => {
      createAccessor(this, key);
    });
    if (!this._connected) {
      cacheDefaults(this, data || {});
      Vue.observable(this._caches);
    }

    // No need for proxy
    // return new Proxy<Model>(this, {
    // set: proxySetter
    // });
  }

  toJSON(parentkey, parentNode) {
    const constructor = getConstructor(this);
    return Object.entries(this).reduce((acc, [key, val]) => {
      if (key in constructor._fields) {
        if (constructor._fields[key].isRelationship) {
          if (!this._load || (this._load && key in this._load)) {
            const node = { item: this, parentNode };
            if (val == null) {
              acc[key] = val;
            } else if (Array.isArray(val)) {
              acc[key] = val.map(item =>
                item.toJSON ? (hasSeen(item, node) ? '>>> Recursive item <<<' : item.toJSON(key, node)) : item
              );
            } else {
              acc[key] = val.toJSON ? (hasSeen(val, node) ? '>>> Recursive item <<<' : val.toJSON(key, node)) : val;
            }
          }
        } else {
          acc[key] = val;
        }
      }
      return acc;
    }, {});
  }

  $toObject(): T {
    return JSON.parse(JSON.stringify(this));
  }

  async $update(data = {}): Promise<string | number> {
    const constructor = getConstructor(this);
    return constructor._store
      .dispatch(`${constructor._namespace}/update`, {
        id: this._id,
        data,
        schema: constructor
      })
      .then(id => {
        this._connected = true;
        return id;
      });
  }

  // @createLogger('save')
  async $save(): Promise<number | string> {
    return new Promise(resolve => {
      const constructor = getConstructor(this);
      if (this._connected) {
        console.warn('No need calling $save');
      } else {
        const item = cacheNames.reduce((acc, name) => {
          return { ...acc, ...this._caches[name] };
        }, {});
        resolve(
          constructor._store
            .dispatch(`${constructor._namespace}/${Actions.ADD}`, { items: item, schema: constructor })
            .then(res => {
              this._id = res;
              this._connected = true;
              return res;
            })
        );
      }
    });
  }

  async $addRelated(related, data): Promise<string | number> {
    const constructor = getConstructor(this);
    return constructor._store.dispatch(`${constructor._namespace}/${Actions.ADD_RELATED}`, {
      id: this._id,
      related,
      data,
      schema: constructor
    });
  }

  async $removeRelated(related, relatedId): Promise<string | number> {
    const constructor = getConstructor(this);
    return constructor._store.dispatch(`${constructor._namespace}/${Actions.REMOVE_RELATED}`, {
      id: this._id,
      related,
      relatedId,
      schema: constructor
    });
  }

  static get relationships(): Record<string, Relationship> {
    return {};
  }

  static get fields(): Record<string, true> | string[] {
    return {};
  }
  static find<T>(this: IModelStatic<T>, id: string | number, opts: FindOptions = {}): T {
    return this._store.getters[`${this._namespace}/${Getters.FIND}`](id, this, opts);
  }
  static findByIds<T>(this: IModelStatic<T>, ids: any[], opts: FindOptions = {}): T[] {
    return this._store.getters[`${this._namespace}/${Getters.FIND_BY_IDS}`](ids, this, opts);
  }
  static all<T>(this: IModelStatic<T>, opts: FindOptions = {}): T[] {
    return this._store.getters[`${this._namespace}/${Getters.ALL}`](this, opts);
  }
  static add(item: any): Promise<string | number> {
    return this._store.dispatch(`${this._namespace}/${Actions.ADD}`, { items: item, schema: this });
  }
  static addAll(items: any[]): Promise<Array<string | number>> {
    return this._store.dispatch(`${this._namespace}/${Actions.ADD}`, { items, schema: [this] });
  }
}

