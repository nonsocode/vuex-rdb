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
    const { Schema, rawContext } = this._extractUtils();
    const referenceArray = rawContext[this._key] || [];
    items.forEach(item => normalizeAndStore(this._store, item, Schema.entityName));

    const ids = items.map(item => getIdValue(item, Schema));

    this._mutateContext([...referenceArray, ...ids]);
    super.push(...(Schema.findByIds(ids, { load: this._context._load?.[this._key] }) as any));
    return this.length;
  }

  pop() {
    const { Schema } = this._extractUtils()
    const removed = super.pop();

    this._mutateContext(this.map(item => getIdValue(item, Schema)))
    return removed;
  }
  
  unshift(...items) {
    const { Schema,  rawContext } = this._extractUtils();
    const referenceArray = rawContext[this._key] || [];
    items.forEach(item => normalizeAndStore(this._store, item, Schema.entityName));

    const ids = items.map(item => getIdValue(item, Schema));

    this._mutateContext([...ids, ...referenceArray])

    super.unshift(...(Schema.findByIds(ids, { load: this._context._load?.[this._key] }) as any));
    return this.length;
  }

  shift() {
    const { Schema } = this._extractUtils()
    const removed = super.shift();
    this._mutateContext(this.map(item => getIdValue(item, Schema)))
    return removed;
  }

  //todo 

  _mutateContext(value) {
    const { contextPath } = this._extractUtils();
    this._store.commit(`${contextPath}/${Mutations.SET_PROP}`, {
      id: this._context._id,
      key: this._key,
      value
    });
  }

  _extractUtils() {
    const ContextSchema = getConstructor(this._context);
    const contextFieldDefinition = ContextSchema._fields[this._key];
    const Schema = getRelationshipSchema(contextFieldDefinition);
    const { _path } = ContextSchema;
    const rawContext = this._store.getters[`${ContextSchema._path}/${Getters.GET_RAW}`](
      getIdValue(this._context, ContextSchema)
    );
    return {
      ContextSchema,
      contextFieldDefinition,
      contextPath: _path,
      rawContext,
      Schema
    };
  }
}

declare global {
  interface Window {
    ModelArray: any;
  }
}
window.ModelArray = ModelArray;
