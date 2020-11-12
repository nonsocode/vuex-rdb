import { hasSeen, identity, isFunction } from './utils';
import { Actions, FindOptions, Getters, IModelConstructor, Mutations, Relationship, Schema } from './types';
import { Store } from 'vuex';
import { getRelationshipSchema } from './relationships';
import { FieldDefinition } from './FieldDefinition';
import { getConstructor, normalizeAndStore, validateEntry } from './modelUtils';
import Vue from 'vue';
import { ModelArray } from './modelArray';
import { ModelQuery } from './query';

const cacheNames = ['data', 'relationship'];


const getCacheName = isRelationship => cacheNames[isRelationship ? 1 : 0];
const parseIfLiteral = (id: any, schema: Schema): any => {
  return ['string', 'number'].includes(typeof id) ? schema.find(id) : id;
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
  const schema = getConstructor(target);
  const { _namespace: path, _store, _fields, id } = schema;
  const isRelationship = key in _fields && _fields[key].isRelationship;
  const relationshipDef = isRelationship ? _fields[key] : null;

  Object.defineProperty(target, key, {
    enumerable: true,
    get() {
      if (target._connected) {
        const raw: any = _store.getters[`${path}/${Getters.GET_RAW}`](this._id, schema);
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
          const oldId = getIdValue(target, schema);
          const newId = getIdValue({ ...target, [key]: value }, schema);
          if (oldId != newId) {
            throw new Error('This update is not allowed becasue the resolved id is different from the orginal value');
          }
        }
      }

      target._connected
        ? _store.commit(`${path}/${Mutations.SET_PROP}`, { id: this._id, key, value, schema })
        : Vue.set(this._caches[getCacheName(isRelationship)], key, value);
    }
  });
}

export function getIdValue<T>(model: T, schema: Schema): string | number {
  return isFunction(schema.id) ? schema.id(model, null, null) : model[schema.id as string];
}

export class Model<T extends any = any>  {

  /**
   * The namespace in the vuex store
   * @internal
   */
  static _namespace: string;

  /**
   * The name of the entity. This is similar to a table name.
   * *Note* This value doesn't have to be unique. Multiple entities can share the same table.
   */
  static entityName: string;

  /**
   * The Vuex store
   * @internal
   */
  static _store: Store<any>;

  /**
   * @internal
   */
  static _fields: Record<string, FieldDefinition>;

  /**
   * The identifier for the model. It also accepts an id resolver function that
   * receives a model-like param as input and returns the id;
   * @default 'id'
   */
  static id: string | ((...args: any[]) => string | number) = 'id';

  /**
   * Used when rendering as JSON. Useful when an enitity has a cylcic relationship. 
   * It specifies exactly which relationships would be rendered out in the JSON representation
   * @internal
   */
  _load;

  /**
   * When a new entity is created and not connected to the Store, it's properties
   * are kept here till `$save` method is called
   * @internal
   */
  _caches;

  /**
   * Indicates wether this model is connected to the store
   */
  _connected = false;

  /**
   * The resolved id of this model
   * @internal
   */
  _id;

  constructor(data?: Partial<T>, opts?: any) {
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

  /**
   * Convert to JSON
   * @internal
   */
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

  /**
   * Converts the model to a plain javascript object.
   */
  $toObject(): Partial<T> {
    return JSON.parse(JSON.stringify(this));
  }

  /**
   * Update the properties of the model with the given data. You don't need to pass the full model.
   * You can pass only the props you want to update, You can also pass related models or model-like data
   */
  async $update(data: Partial<T> = {}): Promise<string | number> {
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

/**
   * Useful when a model is created using `new Model()`.
   * You can assign properties to the model like you would any other javascript
   * object but the new values won't be saved to the vuex store until this method is called;
   *
   * If none model-like data has been assigned to the relationships on `this` model, calling save would
   * transform them to actual models
   */
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
/**
   * Add the given data as a relative of this entity. If the related entity is supposed to be an array,
   * and you pass a non array, it'll be auto converted to an array and appended to the existing related entities for
   * `this` model
   */
  $addRelated(related: string, data: Object): Promise<string | number>;
  $addRelated(related: string, items: any[]): Promise<string | number>;
  async $addRelated(related, data): Promise<string | number> {
    const constructor = getConstructor(this);
    return constructor._store.dispatch(`${constructor._namespace}/${Actions.ADD_RELATED}`, {
      id: this._id,
      related,
      data,
      schema: constructor
    });
  }

  /**
   * Remove the specified entity as a relationship of `this` model
   *
   * if the `related` is a non list relationship, it's deleted from `this` model.
   *
   * if it's a list relationship, you can specify an identifier or a list of identifiers of the related
   * entities to remove as a second parameter or leave blank to remove all items
   */
  $removeRelated(related: string, id?: string | number): Promise<string | number>;
  $removeRelated(related: string, ids?: (string | number)[]): Promise<string | number>;
  async $removeRelated(related, relatedId): Promise<string | number> {
    const constructor = getConstructor(this);
    return constructor._store.dispatch(`${constructor._namespace}/${Actions.REMOVE_RELATED}`, {
      id: this._id,
      related,
      relatedId,
      schema: constructor
    });
  }

  /**
   * This is an alternative to the `Field(() => RelatedModel)` decorator
   * 
   * A record of all the possible relationships of this Schema. Currently, two types are supported
   *
   * - list
   * - item
   *
   * lists are just Model classes in an Array while an Item is the Model Class itself
   *
   * So if we have a `UserModel` that has many `Posts`, we'd define it like so
   *
   * ```javascript
   * class UserModel extends Model {
   *   static get() {
   *     return {
   *       posts: [PostModel], // this signifies a list relationship
   *       school: SchoolModel // This represents an item type relationship
   *     }
   *   }
   * }
   * ```
   * @deprecated
   */
  static get relationships(): Record<string, Relationship> {
    return {};
  }

  /**
   * This is an alternative to the `Field()` decorator. 
   * 
   * Specify the different fields of the class
   * in an array or an object that contains the field names as it's keys
   * @deprecated
   */
  static get fields(): Record<string, true> | string[] {
    return {};
  }

  /**
   * Find a model by the specified identifier
   */
  static find<T>(this: IModelConstructor<T>, id: string | number, opts: FindOptions = {}): T {
    return this._store.getters[`${this._namespace}/${Getters.FIND}`](id, this, opts);
  }

  /**
   * Find all items that match the specified ids
   *
   */
  static findByIds<T>(this: IModelConstructor<T>, ids: any[], opts: FindOptions = {}): T[] {
    return this._store.getters[`${this._namespace}/${Getters.FIND_BY_IDS}`](ids, this, opts);
  }

  /**
   * Get all items of this type from the Database
   */
  static all<T>(this: IModelConstructor<T>, opts: FindOptions = {}): T[] {
    return this._store.getters[`${this._namespace}/${Getters.ALL}`](this, opts);
  }

  /**
   * Add the passed item to the database. It should match this model's schema.
   *
   * It returns a promise of the inserted entity's id
   */
  static add(item: any): Promise<string | number> {
    return this._store.dispatch(`${this._namespace}/${Actions.ADD}`, { items: item, schema: this });
  }

  /**
   * Add the passed items to the database. It should match this model's schema.
   *
   * It returns a promise of an array of ids for the inserted entities.
   */
  static addAll(items: any[]): Promise<Array<string | number>> {
    return this._store.dispatch(`${this._namespace}/${Actions.ADD}`, { items, schema: [this] });
  }

  static query() {
    return new ModelQuery(this);
  }
}

