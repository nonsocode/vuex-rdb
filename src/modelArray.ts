import { getIdValue, Model } from './model';
import { getRelationshipSchema } from './relationships';
import { getConstructor, normalizeAndStore } from './modelUtils';
import { Getters, Mutations } from './types';
import { Store } from 'vuex';


function validate() {
  return (target, key, descriptor: PropertyDescriptor) => {
    const method: Function = descriptor.value;
    descriptor.value = function(this: ModelArray<any>, ...args) {
      const {Schema} = this._extractUtils();
      for (const item of args) {
        if(getIdValue(item, Schema) == null) {
          throw new Error(`An item being assigned to this array does not have a valid identifier`)
        }
      }
      method.apply(this, args)
    }
  }
}
export class ModelArray<T extends Model<T>> extends Array<T> {
  _context: Model<any>;
  _key: string;
  _store: Store<any>;

  constructor(context: Model<any>, key: string, items: T[]) {
    super();
    Object.defineProperties(this, {
      _context: { value: context },
      _key: { value: key },
      _store: { value: getConstructor(context)._store }
    });
    super.push.apply(this, items);
    Object.setPrototypeOf(this, ModelArray.prototype);
  }

  @validate()
  push(...items) {
    const { Schema, rawContext } = this._extractUtils(true);
    const referenceArray = rawContext[this._key] || [];
    items.forEach(item => normalizeAndStore(this._store, item, Schema));

    const ids = items.map(item => getIdValue(item, Schema));

    this._mutateContext([...referenceArray, ...ids]);
    super.push(...(Schema.findByIds(ids, { load: this._context._load?.[this._key] }) as any));
    return this.length;
  }

  pop() {
    const { Schema } = this._extractUtils();
    const removed = super.pop();

    this._mutateContext(this.map(item => getIdValue(item, Schema)));
    return removed;
  }

  @validate()
  unshift(...items) {
    const { Schema, rawContext } = this._extractUtils(true);
    const referenceArray = rawContext[this._key] || [];
    items.forEach(item => normalizeAndStore(this._store, item, Schema));

    const ids = items.map(item => getIdValue(item, Schema));

    this._mutateContext([...ids, ...referenceArray]);

    super.unshift(...(Schema.findByIds(ids, { load: this._context._load?.[this._key] }) as any));
    return this.length;
  }

  shift() {
    const { Schema } = this._extractUtils();
    const removed = super.shift();
    this._mutateContext(this.map(item => getIdValue(item, Schema)));
    return removed;
  }

  //todo

  _mutateContext(value) {
    const { ContextSchema } = this._extractUtils();
    this._store.commit(`${ContextSchema._namespace}/${Mutations.SET_PROP}`, {
      id: this._context._id,
      key: this._key,
      value,
      schema: ContextSchema
    });
  }

  _extractUtils(withRawData = false) {
    const ContextSchema = getConstructor(this._context);
    const Schema = getRelationshipSchema(ContextSchema._fields[this._key]);
    const rawContext = withRawData
      ? this._store.getters[`${ContextSchema._namespace}/${Getters.GET_RAW}`](
          getIdValue(this._context, ContextSchema),
          ContextSchema
        )
      : null;
    return {
      ContextSchema,
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
