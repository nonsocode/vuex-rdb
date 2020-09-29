import {isFunction, mergeUnique} from './utils';
import {Actions, FindOptions, Getters, IModel, IModelStatic, Relationship} from './types';
import {Store} from 'vuex';
import { schema } from 'normalizr';
import SchemaFunction = schema.SchemaFunction;
import { getRelationshipSchema, isList } from './relationships';

const cacheNames = ['_dataCache', '_relationshipCache', '_changes'];
const internals = [...cacheNames, '_options', '_connected'].reduce((acc, key) => {
  acc[key] = true
  return acc;
}, {});

const getCacheName = (target, key) => key in (target.constructor as typeof Model).relationships ? '_relationshipCache' : '_dataCache';

const externalGet = (target: Model, key: string, receiver) => {
  if(key in target) return target[key];
  return  target._changes[key] !== undefined ? target._changes[key] : target[getCacheName(target, key)][key];
}
const externalSet = (target: Model, key: string, value) => {
  if(!(key in target)) {
    createAccessor(target, key)
  }
  if(internals[key]) {target[key] = value}
  else {target._changes[key] = value;}
  return true
}

function createAccessor (target, key) {
  Object.defineProperty(target, key, {
    enumerable: true,
    get() {
      return this._changes[key] !== undefined ? this._changes[key] : this[getCacheName(this, key)][key];
    },
    set(value) {
      this._changes[key] = value
    }
  })
}
const internalSet = (target, key, value) => {
  if(!(key in target)) {
    createAccessor(target, key)
  }
  target[getCacheName(target, key)][key] = value
}

const hydrate = (husk: Model, fountain = {}) => {
  Object.entries(fountain).forEach(([key, value]) => {
    internalSet(husk, key, value)
  })
}

export function getId<T>(model: T, schema: typeof Model): string | number {
  return isFunction(schema.id) ? schema.id(model, null, null) : model[schema.id];
}

function setCurrentPropsFromRaw<T>(model: Model, data: any = {}, options: any = {}) {
  const schema = model.constructor as typeof Model;
  Object.entries(data).forEach(([key, value]) => {
    const isRelationship = key in schema.relationships;
    if (!isRelationship) {
      model._dataCache[key] = value;
    } else {
      const relationshipDef = schema.relationships[key];
      const load = { ...options?.load?.[key] };
      model._relationshipCache[key] = isList(relationshipDef)
        ? getRelationshipSchema(relationshipDef).findByIds(
          (value as Array<any>).map(v => getId(v, getRelationshipSchema(relationshipDef))),
          { load }
        )
        : value && relationshipDef.find(getId(value, getRelationshipSchema(relationshipDef)), { load });
    }
  });
}


export class Model implements IModel {
  private _options: any = {};
  public static _path: string;
  public static entityName: string;
  public static _store: Store<any>;
  static id: string | SchemaFunction = "id";
  _dataCache;
  _relationshipCache;
  _changes;
  private _connected = false;
  

  constructor(data: any, opts: any = {}, connected = false) {
    Object.defineProperties(this, {
      ...Object.fromEntries(cacheNames.map(cacheName => [cacheName, {value:{}}])),
      _options: { value: { ...opts }, enumerable: false },
      _connected: {value: connected, enumerable: false, configurable: true}
    });
    this._connected = connected;
    if(data) {
      hydrate(this, data)
    }
    
    return new Proxy<Model>(this, {
      get: externalGet,
      set: externalSet,
    })
  }

  static get relationships(): Record<string, Relationship> {
    return {};
  }

  protected get _id(): string | number {
    return getId(this, this.constructor as typeof Model);
  }

  async $update(data = {}): Promise<string | number> {
    const constructor = this.constructor as typeof Model;
    return constructor._store
      .dispatch(`${constructor._path}/update`, {
        id: this._id,
        data
      })
      .then(id => {
        setCurrentPropsFromRaw(this, data, this._options);
        this.$resetChanges();
        return id;
      });
  }

  async $save(): Promise<number | string> {
    let result;
    const constructor = this.constructor as typeof Model;
    if(this._connected) {
      result = this.$update({ ...this._changes });
    } else {
      const data = {...this._dataCache, ...this._relationshipCache, ...this._changes};
      result = (constructor)._store.dispatch(`${constructor._path}/add`,data)
      .then(res => {
        setCurrentPropsFromRaw(this, data, this._options);
        this._connected = true;
        this.$resetChanges()
        return res
      })
    }
    return ;
  }

  async $addRelated(related, data): Promise<string | number> {
    const constructor = this.constructor as typeof Model;
    return constructor._store
      .dispatch(`${constructor._path}/addRelated`, {
        id: this._id,
        related,
        data
      })
      .then(ids => {
        if (['*', related].some(prop => this._options?.load?.[prop])) {
          const relationshipDef = (this.constructor as typeof Model).relationships[related];
          const shouldBeArray = isList(relationshipDef);
          data = shouldBeArray
            ? mergeUnique((this[related] || []).concat(!Array.isArray(data) ? [data] : data), item =>
              getId(item, shouldBeArray ? relationshipDef[0] : relationshipDef)
            )
            : data;
          setCurrentPropsFromRaw(this, { [related]: data }, this._options);
        }
        return ids;
      });
  }

  async $fresh(): Promise<this> {
    // Todo: populate with new data
    const newModel = (this.constructor as typeof Model).find(this._id, this._options);
    hydrate(this, newModel);
    return this;
  }

  $changes() {
    return { ...this._changes };
  }

  $resetChanges() {
    Object.keys(this._changes).forEach(key => {
      delete this._changes[key];
    });
  }
  async $removeRelated(related, relatedId): Promise<string | number> {
    const constructor = this.constructor as typeof Model;
    return constructor._store
      .dispatch(`${constructor._path}/removeRelated`, {
        id: this._id,
        related,
        relatedId
      })
      .then(ids => {
        if (['*', related].some(prop => this._options?.load?.[prop])) {
          const relationshipDef = (this.constructor as typeof Model).relationships[related];
          let data;
          if (isList(relationshipDef)) {
            if (!relatedId) {
              data = [];
            } else {
              const items: Model[] = this[related];
              const ids = Array.isArray(relatedId) ? relatedId : [relatedId];
              data = items
                ? items.filter(item => !ids.includes(getId(item, getRelationshipSchema(relationshipDef))))
                : [];
            }
          } else {
            data = null;
          }
          setCurrentPropsFromRaw(this, { [related]: data }, this._options);
        }

        return ids;
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
