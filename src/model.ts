import {createObject, isFunction, mergeUnique, ucFirst} from './utils';
import {Actions, FindOptions, Getters, IModel, IModelStatic, Mutations, Relationship} from './types';
import {Store} from 'vuex';
import { schema } from 'normalizr';
import SchemaFunction = schema.SchemaFunction;
import { getRelationshipSchema, isList } from './relationships';
import { entitySchemas, nameModelMap } from './registrar';
import { normalize } from 'normalizr';

const cacheNames = ['_dataCache', '_relationshipCache'];

const reservedKeys = createObject({toJSON: true, _isVue: true, [Symbol.toStringTag]: true})

const getCacheName = (target, key) => key in (target.constructor as typeof Model)._relationships ? '_relationshipCache' : '_dataCache';

const proxySetter = (target: Model, key: string, value) => {
  
  if(!(key in target) && !(key in reservedKeys)) {
    createAccessor(target, key)
  }
  target[key] = value
  return true
}
const proxyGetter = (target: Model, key: string | symbol, value) => {
  /* This useful only when the fields aren't known upfront but can add a lot of unnecessary props 
   when non existent fields are accessed
   */
  // if(!(key in target)  && !(key in reservedKeys)) {
  //   createAccessor(target, key)
  // }
  return target[key]
}

function createAccessor (target: Model, key) {
  const constructor = target.constructor as typeof Model;
  const store = constructor._store;
  const isRelationship = key in constructor._relationships;
  const relationshipDef = isRelationship ? constructor._relationships[key] : null

  Object.defineProperty(target, key, {
    enumerable: true,
    get() {
      if(target._connected) {
        const raw: any = store.getters[`${constructor._path}/${Getters.GET_RAW}`](this._id);
        const value = raw[key];
        if(isRelationship) {
          const opts = {load: target._load[key] || {}};
          const Related = getRelationshipSchema(relationshipDef);
          if(isList(relationshipDef)) {
            return value && Related.findByIds(value, opts);
          }
          return Related.find(value, opts)
        } else {
          return raw[key]
        }
      }
      return this[getCacheName(this, key)][key];
    },
    set(value) {
      if(target._connected) {
        if(value != null) {
          if(isRelationship) {
            const list = isList(relationshipDef);
            const Related = getRelationshipSchema(relationshipDef);
            if(list) {
              value = Array.isArray(value) ? value : [value];
            } 
            const entitySchema = entitySchemas.get(Related);
            const { entities, result } = normalize(value, list ? [entitySchema] : entitySchema);
            Object.entries(entities).forEach(([entityName, entities]) => {
              Object.entries(entities).forEach(([id, entity]) => {
                if (!entity) {
                  return;
                }
                store.commit(`${nameModelMap.get(entityName)._path}/${Mutations.ADD}`, { id, entity }, { root: true });
              });
            });
            value = result;
          } 
        }
        return constructor._store.commit(`${constructor._path}/${Mutations.SET_PROP}`, {id: this._id, key, value})
      } else {
        this[getCacheName(this, key)][key] = value
      }
    }
  })
}

export function getIdValue<T>(model: T, schema: typeof Model): string | number {
  return isFunction(schema.id) ? schema.id(model, null, null) : model[schema.id as string];
}

const reserved = [...cacheNames, '_id', '_connected'].reduce((acc, key) => {
  acc[key] = true
  return acc
}, {})

export class Model implements IModel {
  public static _path: string;
  public static entityName: string;
  public static _store: Store<any>;
  public static _fields: Record<string, boolean> = {};
  public static _relationships: Record<string, Relationship> = {}
  static id: string | SchemaFunction = "id";
  
  _load;
  _dataCache;
  _relationshipCache;
  _connected = false;
  _id;

  

  constructor(data: any, opts: any = {}) {
    Object.defineProperties(this, {
      ...Object.fromEntries(cacheNames.map(cacheName => [cacheName, {value:{}}])),
      _connected: {value: !!(opts?.connected), enumerable: false, configurable: true},
      _load: {value: (opts?.load || createObject({})), enumerable: false, configurable: true},
      _id:{value: data ? getIdValue(data, this.constructor as typeof Model) : null, enumerable: false, configurable: false, writable: true}
    });
    const {_relationships, _fields} = this.constructor as typeof Model;
    console.log({_relationships, _fields})

    if(data) {
      Object.keys(data).forEach(key => createAccessor(this, key))
    }

    Object.keys({..._relationships, ..._fields}).forEach(key => {
      if(key in this) return;
      createAccessor(this, key)
    })
    
    return new Proxy<Model>(this, {
      set: proxySetter,
      get: proxyGetter,
    })
  }

  toJSON() {
    const constructor = this.constructor as typeof Model
    return Object.entries(this).reduce((acc, [key, val]) => {
      if(!(key in constructor._relationships)) {
        acc[key] = val
      } else {
        if([key, '*'].some(prop => prop in this._load)) {
          if(val == null) {
            acc[key] = val
          } else if (Array.isArray(val)) {
            acc[key] = val.map(item => item.toJSON())
          } else {
            acc[key] = val.toJSON()
          }
        }
      }
      return acc;
    }, {})
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
      if(this._connected) {
        console.warn('No need calling $save');
      } else {
        const data = {...this._dataCache, ...this._relationshipCache};
        resolve((constructor)._store.dispatch(`${constructor._path}/add`,data)
        .then(res => {
          this._id = res
          this._connected = true;
          return res
        }));
      }
    })
  }

  async $addRelated(related, data): Promise<string | number> {
    const constructor = this.constructor as typeof Model;
    return constructor._store
      .dispatch(`${constructor._path}/addRelated`, {
        id: this._id,
        related,
        data
      })
  }

  async $removeRelated(related, relatedId): Promise<string | number> {
    const constructor = this.constructor as typeof Model;
    return constructor._store
      .dispatch(`${constructor._path}/removeRelated`, {
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
