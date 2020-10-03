import { getIdValue, Model } from './model';
import { getRelationshipSchema } from './relationships';
import { getConstructor, normalizeAndStore } from './modelUtils';
import { Getters, Mutations } from './types';
import { Store } from 'vuex';
export class ModelArray<T extends Model> extends Array<T> {
  _context: Model;
  _key: string;
  _store: Store<any>;

  constructor(context: Model, key: string, items: T[]) {
    super();
    Object.defineProperties(this, {
      _context: { value: context },
      _key: { value: key },
      _store: { value: getConstructor(context)._store }
    });
    super.push.apply(this, items);
    Object.setPrototypeOf(this, ModelArray.prototype);
  }

  push(...items) {
    const ContextSchema = getConstructor(this._context);
    const fieldDefinition = ContextSchema._fields[this._key];
    const Schema = getRelationshipSchema(fieldDefinition);
    const { _path } = ContextSchema;
    const rawContext = this._store.getters[`${ContextSchema._path}/${Getters.GET_RAW}`](
      getIdValue(this._context, ContextSchema)
    );
    const referenceArray = rawContext[this._key] || [];
    items.forEach(item => normalizeAndStore(this._store, item, Schema.entityName));

    const ids = items.map(item => getIdValue(item, Schema));

    this._store.commit(`${_path}/${Mutations.SET_PROP}`, { id: this._context._id, key: this._key, value: [...referenceArray, ...ids] });
    super.push(...Schema.findByIds(ids, { load: this._context._load?.[this._key] }) as any);
    return this.length;
  }

  _extractUtils() {}
}

declare global {
  interface Window {
    ModelArray: any;
  }
}
window.ModelArray = ModelArray;
