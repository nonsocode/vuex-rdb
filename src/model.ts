import {isFunction, mergeUnique} from './utils';
import {Actions, FindOptions, Getters, IModel, IModelStatic, Relationship} from './types';
import {Store} from 'vuex';
import { schema } from 'normalizr';
import SchemaFunction = schema.SchemaFunction;
import { getRelationshipSchema, isList } from './relationships';

const cacheNames = ['_dataCache', '_relationshipCache', '_changes'];
const internal = [...cacheNames, '_options'];
const getCacheName = (target, key) => key in (target.constructor as typeof Model).relationships ? '_relationshipCache' : '_dataCache';
const unique = (...items) => [...new Set(items.flat())]
const enumerator = (target) => unique(cacheNames.map(name => Object.keys(target[name])))
const externalGet = (target: Model, key: string, receiver) => {
  if(internal.includes(key)) return target[key];
  return  target._changes[key] !== undefined ? target._changes[key] : target[getCacheName(target, key)][key];
}
const externalSet = (target: Model, key: string, value) => {
  if(internal.includes(key))
  target._changes[key] = value
  return true
}
const internalSet = (target, key, value) => {
  target[getCacheName(target, key)] = value
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
  static id: string | SchemaFunction;
  _dataCache;
  _relationshipCache;
  _changes;
  

  constructor(data: any, opts: any = {}) {
    Object.defineProperties(this, {
      ...Object.fromEntries(cacheNames.map(cacheName => [cacheName, {value:{}}])),
      _options: { value: { ...opts }, enumerable: false },
    });
    if(data) {
      hydrate(this, data)
    }
    
    // return new Proxy<Model>(this, {
    //   get: externalGet,
    //   set: externalSet,
    //   enumerate: enumerator,
    //   ownKeys: enumerator,
    // })
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
      .then(ids => {
        setCurrentPropsFromRaw(this, data, this._options);
        return ids;
      });
  }

  async $save(): Promise<number | string> {
    return this.$update({ ...this._changes });
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
