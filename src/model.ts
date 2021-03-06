import { hasSeen } from './utils';
import { Actions, FieldDefinitionOptions, FindOptions, Getters, IdValue, Schema, SchemaFactory } from './types';
import { Store } from 'vuex';
import { FieldDefinition, SimpleFieldDefinition } from './relationships/field-definition';
import {
  cacheDefaults,
  cacheNames,
  createAccessor,
  getConstructor,
  getIdValue,
  getRecursionMessage,
  modelToObject,
} from './modelUtils';
import Vue from 'vue';
import { ModelQuery } from './query/model-query';
import { Load } from './query/load';
import { Relationship } from './relationships/relationhsip';
import { ListRelationship } from './relationships/list';
import { ItemRelationship } from './relationships/item';
import { Field, Item, List } from './index';
import { BelongsTo } from './annotations/belongs-to';
import { BelongsToRelationship } from './relationships/belongs-to';
import { HasManyRelationship } from './relationships/HasMany';
import { HasMany } from './annotations/has-many';
import { Index } from './relationships/indices';

export class Model<T extends any = any> {
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
   * @internal
   */
  static index: Index;

  /**
   * The identifier for the model. It also accepts an id resolver function that
   * receives a model-like param as input and returns the id;
   * @default 'id'
   */
  static id: string | ((...args: any[]) => IdValue) = 'id';

  /**
   * Used when rendering as JSON. Useful when an enitity has a cylcic relationship.
   * It specifies exactly which relationships would be rendered out in the JSON representation
   * @internal
   */
  _load: Load;

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

  constructor(data?: Partial<T>, opts?: { load?: Load; connected?: boolean }) {
    const id = data ? getIdValue(data, getConstructor(this)) : null;

    Object.defineProperties(this, {
      _caches: { value: Object.fromEntries(cacheNames.map((name) => [name, {}])) },
      _connected: { value: !!opts?.connected, enumerable: false, configurable: true },
      _load: { value: opts?.load, enumerable: false, configurable: true },
      _id: { value: id, enumerable: false, configurable: false, writable: true },
    });

    const { _fields } = getConstructor(this);
    for (let key of Object.keys(_fields)) {
      createAccessor(this, key);
    }
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
    const json = {};
    for (let [key, val] of Object.entries(this)) {
      if (key in constructor._fields) {
        if (constructor._fields[key] instanceof Relationship) {
          const node = { item: this, parentNode };
          if (val == null) {
            json[key] = val;
          } else if (Array.isArray(val)) {
            let items = [];
            for (let item of <Model[]>val) {
              items.push(
                item.toJSON ? (hasSeen(item, node) ? getRecursionMessage(item) : item.toJSON(key, node)) : item
              );
            }
            json[key] = items;
          } else {
            json[key] = val.toJSON ? (hasSeen(val, node) ? getRecursionMessage(val) : val.toJSON(key, node)) : val;
          }
        } else {
          json[key] = val;
        }
      }
    }
    return json;
  }

  /**
   * Converts the model to a plain javascript object.
   */
  $toObject(allProps: boolean = false): Partial<T> {
    return modelToObject(this, getConstructor(this), allProps);
  }

  /**
   * Update the properties of the model with the given data. You don't need to pass the full model.
   * You can pass only the props you want to update, You can also pass related models or model-like data
   */
  async $update(data: Partial<T> = {}): Promise<IdValue> {
    const constructor = getConstructor(this);
    return constructor._store
      .dispatch(`${constructor._namespace}/update`, {
        id: this._id,
        data,
        schema: constructor,
      })
      .then((id) => {
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
    return new Promise((resolve) => {
      const constructor = getConstructor(this);
      if (this._connected) {
        console.warn('No need calling $save. This entity is already connected to the Vuex store');
      } else {
        const item = cacheNames.reduce((acc, name) => {
          return { ...acc, ...this._caches[name] };
        }, {});
        resolve(
          constructor._store
            .dispatch(`${constructor._namespace}/${Actions.ADD}`, { items: item, schema: constructor })
            .then((res) => {
              this._id = res;
              this._connected = true;
              return res;
            })
        );
      }
    });
  }

  /**
   * This is an alternative to the `Field(), List(), Item(), BelongsTo() and HasMany()` decorators.
   *
   * Specify the different fields of the class
   * in an object that contains the field names as it's keys
   * e.g
   * ```javascript
   * class User extends model {
   *   static get fields() {
   *     return {
   *       id: this.$field(),
   *       name: this.$field(),
   *       posts: this.$hasMany(() => Post)
   *     }
   *   }
   * }
   * ```
   * @deprecated
   */
  static get fields(): Record<string, FieldDefinition> {
    return {};
  }

  /**
   * Find a model by the specified identifier
   */
  static find<T extends Schema>(this: T, id: IdValue, opts: FindOptions = {}): InstanceType<T> {
    return this._store.getters[`${this._namespace}/${Getters.FIND}`](id, this, opts);
  }

  /**
   * Find all items that match the specified ids
   *
   */
  static findByIds<T extends Schema>(this: T, ids: any[], opts: FindOptions = {}): InstanceType<T>[] {
    return this._store.getters[`${this._namespace}/${Getters.FIND_BY_IDS}`](ids, this, opts);
  }

  /**
   * Get all items of this type from the Database
   */
  static all<T extends Schema>(this: T, opts: FindOptions = {}): InstanceType<T>[] {
    return this._store.getters[`${this._namespace}/${Getters.ALL}`](this, opts);
  }

  /**
   * Add the passed item to the database. It should match this model's schema.
   *
   * It returns a promise of the inserted entity's id
   */
  static add(item: any): Promise<IdValue> {
    return this._store.dispatch(`${this._namespace}/${Actions.ADD}`, { items: item, schema: this });
  }

  /**
   * Add the passed items to the database. It should match this model's schema.
   *
   * It returns a promise of an array of ids for the inserted entities.
   */
  static addAll(items: any[]): Promise<Array<IdValue>> {
    return this._store.dispatch(`${this._namespace}/${Actions.ADD}`, { items, schema: [this] });
  }

  static $item<T extends Schema>(factory: SchemaFactory<T>): ItemRelationship<T> {
    return Item.define(factory, () => this);
  }

  static $list<T extends Schema>(factory: SchemaFactory<T>): ListRelationship<T> {
    return List.define(factory, () => this);
  }

  static $field(options: FieldDefinitionOptions = {}): SimpleFieldDefinition {
    return Field.define(options);
  }

  static $belongsTo<T extends Schema>(factory: SchemaFactory<T>, foreignKey: string): BelongsToRelationship<T> {
    return BelongsTo.define(factory, () => this, foreignKey);
  }

  static $hasMany<T extends Schema>(factory: SchemaFactory<T>, foreignKey: string): HasManyRelationship<T> {
    return HasMany.define(factory, () => this, foreignKey);
  }

  static query<T extends Schema>(this: T, fn?: (query: ModelQuery<T>) => void): ModelQuery<T> {
    const query = new ModelQuery(this);
    fn && fn(query);
    return query;
  }
}
