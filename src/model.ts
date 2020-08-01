import { isFunction, mergeUnique } from './utils';
import { Actions, FindOptions, Getters, IModel, IModelStatic, Relationship } from '@/types';
import { Store } from 'vuex';
import { schema } from 'normalizr';
import SchemaFunction = schema.SchemaFunction;
import { getRelationshipSchema, isList } from './relationships';
const cacheNames = ['_dataCache', '_relationshipCache', '_changes'];
export function getId<T>(model: T, schema: IModelStatic<T>): string | number {
  return isFunction(schema.id) ? schema.id(model, null, null) : model[schema.id];
}
function appendReducer(acc, key) {
  acc[key] = null;
  return acc;
}
function setAppendableDescriptors<T>(model: Model, appendable) {
  const schema = model.constructor as IModelStatic<T>;
  let keys;
  if (appendable['*']) {
    keys = Object.keys(schema.relationships);
  } else {
    keys = Object.keys(appendable).filter(k => k !== '*');
  }
  const data = keys.reduce(appendReducer, {});
  setDescriptors(model, data);
}
function setDescriptors<T>(model: Model, data: any = {}, setValues = false): void {
  const schema = model.constructor as IModelStatic<T>;
  Object.entries(data).forEach(([key, value]) => {
    const isRelationship = key in schema.relationships;
    const cacheName = isRelationship ? '_relationshipCache' : '_dataCache';
    if (!Object.getOwnPropertyDescriptor(model, key)) {
      Object.defineProperty(model, key, {
        get() {
          return this._changes[key] !== undefined ? this._changes[key] : this[cacheName][key];
        },
        set(val) {
          this._changes[key] = val;
        },
        enumerable: true
      });
    }
    setValues && (model[cacheName][key] = value);
  });
  model.$resetChanges();
}
function setCurrentPropsFromRaw<T>(model: Model, data: any = {}, options: any = {}) {
  setDescriptors(model, data);
  const schema = model.constructor as IModelStatic<T>;
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
  public static _store: Store<any>;
  static id: string | SchemaFunction;
  public static entityName: string;
  public static accessors;
  _dataCache;
  _relationshipCache;
  _changes;

  constructor(data: any, opts: any = {}) {
    cacheNames.forEach(cacheName => {
      Object.defineProperty(this, cacheName, {
        value: {}
      });
    });
    if (opts.load) {
      setAppendableDescriptors(this, opts.load);
    }
    setDescriptors(this, data, true);

    const privateDescriptors = {
      _options: { value: { ...opts }, enumerable: false }
    };
    const descriptors = {
      ...privateDescriptors
    };
    Object.defineProperties(this, descriptors);
  }

  static get relationships(): Record<string, Relationship> {
    return {};
  }

  protected get _id(): string | number {
    return getId(this, this.constructor as IModelStatic<this>);
  }

  async $update(data = {}): Promise<string | number> {
    const constructor = this.constructor as IModelStatic<this>;
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
    const constructor = this.constructor as IModelStatic<this>;
    return constructor._store
      .dispatch(`${constructor._path}/addRelated`, {
        id: this._id,
        related,
        data
      })
      .then(ids => {
        if (['*', related].some(prop => this._options?.load?.[prop])) {
          const relationshipDef = (this.constructor as IModelStatic<this>).relationships[related];
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
    const newModel = (this.constructor as IModelStatic<this>).find(this._id, this._options);
    setDescriptors(this, newModel, true);
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
    const constructor = this.constructor as IModelStatic<this>;
    return constructor._store
      .dispatch(`${constructor._path}/removeRelated`, {
        id: this._id,
        related,
        relatedId
      })
      .then(ids => {
        if (['*', related].some(prop => this._options?.load?.[prop])) {
          const relationshipDef = (this.constructor as IModelStatic<this>).relationships[related];
          let data;
          if (isList(relationshipDef)) {
            if (!relatedId) {
              data = [];
            } else {
              const items: Model[] = this[related];
              const ids = Array.isArray(relatedId) ? relatedId : [relatedId];
              data = items ? items.filter(item => !ids.includes(getId(item, getRelationshipSchema(relationshipDef)))) : [];
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
