import { createObject, identity, isFunction, mergeUnique, ucFirst } from './utils';
import { Actions, FindOptions, Getters, IModel, IModelStatic, Mutations, Relationship } from './types';
import { Store } from 'vuex';
import { getRelationshipSchema } from './relationships';
import { nameModelMap } from './registrar';
import { normalize } from './normalize';
import { FieldDefinition } from './FieldDefinition';
import Vue from 'vue';
const cacheNames = ['data', 'relationship'];

const reservedKeys = createObject({ toJSON: true, _isVue: true, [Symbol.toStringTag]: true });

const getCacheName = isRelationship => cacheNames[isRelationship ? 1 : 0];
const parseIfLiteral = (id: any, Schema: typeof Model): any => {
  return ['string', 'number'].includes(typeof id) ? Schema.find(id) : id;
};
const proxySetter = (target: Model, key: string, value) => {
  if (!(key in target) && !(key in reservedKeys)) {
    createAccessor(target, key);
  }
  target[key] = value;
  return true;
};

function createAccessor(target: Model, key) {
  const { _path, _store, _fields } = target.constructor as typeof Model;
  const isRelationship = key in _fields && _fields[key].isRelationship;
  const relationshipDef = isRelationship ? _fields[key] : null;

  Object.defineProperty(target, key, {
    enumerable: true,
    get() {
      if (target._connected) {
        const raw: any = _store.getters[`${_path}/${Getters.GET_RAW}`](this._id);
        const value = raw[key];
        if (isRelationship) {
          const opts = { load: target._load[key] || {} };
          const Related = getRelationshipSchema(relationshipDef);
          if (relationshipDef.isList) {
            return value && Related.findByIds(value, opts);
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
        }
        if (target._connected) {
          const { entities, result } = normalize(value, relationshipDef.entity);
          Object.entries(entities).forEach(([entityName, entities]) => {
            Object.entries(entities).forEach(([id, entity]) => {
              if (!entity) {
                return;
              }
              _store.commit(`${nameModelMap.get(entityName)._path}/${Mutations.ADD}`, { id, entity }, { root: true });
            });
          });
          value = result;
        }
      }

      target._connected
        ? _store.commit(`${_path}/${Mutations.SET_PROP}`, { id: this._id, key, value })
        : Vue.set(this._caches[getCacheName(isRelationship)], key, value);
    }
  });
}

export function getIdValue<T>(model: T, schema: typeof Model): string | number {
  return isFunction(schema.id) ? schema.id(model, null, null) : model[schema.id as string];
}

const reserved = [...cacheNames, '_id', '_connected'].reduce((acc, key) => {
  acc[key] = true;
  return acc;
}, {});

export class Model implements IModel {
  public static _path: string;
  public static entityName: string;
  public static _store: Store<any>;
  public static _fields: Record<string, FieldDefinition>;
  static id: string | ((...args: any[]) => string | number) = 'id';

  _load;
  _caches;
  _connected = false;
  _id;

  constructor(data: any, opts: any = {}) {
    Object.defineProperties(this, {
      _caches: {
        value: Object.fromEntries(cacheNames.map(name => [name, {}]))
      },
      _connected: { value: !!opts?.connected, enumerable: false, configurable: true },
      _load: { value: opts?.load || createObject({}), enumerable: false, configurable: true },
      _id: {
        value: data ? getIdValue(data, this.constructor as typeof Model) : null,
        enumerable: false,
        configurable: false,
        writable: true
      }
    });
    if (!this._connected) Vue.observable(this._caches);
    const { _fields } = this.constructor as typeof Model;

    if (data) {
      Object.keys(data).forEach(key => createAccessor(this, key));
    }

    Object.keys({ ..._fields }).forEach(key => {
      if (key in this) return;
      createAccessor(this, key);
    });

    return new Proxy<Model>(this, {
      set: proxySetter
    });
  }

  toJSON() {
    const constructor = this.constructor as typeof Model;
    return Object.entries(this).reduce((acc, [key, val]) => {
      if (!(key in constructor._fields && constructor._fields[key].isRelationship)) {
        acc[key] = val;
      } else {
        if ([key, '*'].some(prop => prop in this._load)) {
          if (val == null) {
            acc[key] = val;
          } else if (Array.isArray(val)) {
            acc[key] = val.map(item => (item.toJSON ? item.toJSON() : item));
          } else {
            acc[key] = val.toJSON ? val.toJSON() : val;
          }
        }
      }
      return acc;
    }, {});
  }

  static get relationships(): Record<string, Relationship> {
    return {};
  }

  static get fields(): Record<string, true> | string[] {
    return {};
  }

  async $update(data = {}): Promise<string | number> {
    const constructor = this.constructor as typeof Model;
    return constructor._store
      .dispatch(`${constructor._path}/update`, {
        id: this._id,
        data
      })
      .then(id => {
        this._connected = true;
        return id;
      });
  }

  async $save(): Promise<number | string> {
    return new Promise(resolve => {
      const constructor = this.constructor as typeof Model;
      if (this._connected) {
        console.warn('No need calling $save');
      } else {
        const data = cacheNames.reduce((acc, name) => {
          return { ...acc, ...this._caches[name] };
        }, {});
        resolve(
          constructor._store.dispatch(`${constructor._path}/add`, data).then(res => {
            this._id = res;
            this._connected = true;
            return res;
          })
        );
      }
    });
  }

  async $addRelated(related, data): Promise<string | number> {
    const constructor = this.constructor as typeof Model;
    return constructor._store.dispatch(`${constructor._path}/addRelated`, {
      id: this._id,
      related,
      data
    });
  }

  async $removeRelated(related, relatedId): Promise<string | number> {
    const constructor = this.constructor as typeof Model;
    return constructor._store.dispatch(`${constructor._path}/removeRelated`, {
      id: this._id,
      related,
      relatedId
    });
  }
  static find<T>(this: IModelStatic<T>, id: string | number, opts: FindOptions = {}): T {
    return this._store.getters[`${this._path}/${Getters.FIND}`](id, opts);
  }
  static findByIds<T>(this: IModelStatic<T>, ids: any[], opts: FindOptions = {}): T[] {
    return this._store.getters[`${this._path}/${Getters.FIND_BY_IDS}`](ids, opts);
  }
  static all<T>(this: IModelStatic<T>, opts: FindOptions = {}): T[] {
    return this._store.getters[`${this._path}/${Getters.ALL}`](opts);
  }
  static add(item: any): Promise<string | number> {
    return this._store.dispatch(`${this._path}/${Actions.ADD}`, item);
  }
  static addAll(items: any[]): Promise<Array<string | number>> {
    return this._store.dispatch(`${this._path}/${Actions.ADD_ALL}`, items);
  }
}
