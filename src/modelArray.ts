import {getIdValue, Model} from './model';
import {getConstructor, normalizeAndStore} from './modelUtils';
import {Getters, Mutations, Schema} from './types';
import {Store} from 'vuex';
import {Relationship} from './relationships/relationhsip';

function validateItems(items: any[], schema: Schema) {
  for (const item of items) {
    if (getIdValue(item, schema) == null) {
      throw new Error(`An item being assigned to this array does not have a valid identifier`);
    }
  }
}

function validate() {
  return (target, key, descriptor: PropertyDescriptor) => {
    const method: Function = descriptor.value;
    descriptor.value = function (this: ModelArray<any>, ...args) {
      const { schema } = this._extractUtils();
      validateItems(args, schema);
      method.apply(this, args);
    };
  };
}

function validateSplice() {
  return (target, key, descriptor: PropertyDescriptor) => {
    const method: Function = descriptor.value;
    descriptor.value = function (this: ModelArray<any>, ...args) {
      const { schema } = this._extractUtils();
      let [, , ...items] = args;
      items.length && validateItems(items, schema);
      method.apply(this, args);
    };
  };
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
      _store: { value: getConstructor(context)._store },
    });
    super.push.apply(this, items);
    Object.setPrototypeOf(this, ModelArray.prototype);
  }

  @validate()
  push(...items) {
    const { schema, rawContext } = this._extractUtils(true);
    const referenceArray = rawContext[this._key] || [];
    items.forEach((item) => normalizeAndStore(this._store, item, schema));

    const ids = items.map((item) => getIdValue(item, schema));

    this._mutateContext([...referenceArray, ...ids]);
    super.push(...(schema.findByIds(ids, { load: this._context._load?.[this._key] }) as any));
    return this.length;
  }

  pop() {
    const { schema } = this._extractUtils();
    const removed = super.pop();

    this._mutateContext(this.map((item) => getIdValue(item, schema)));
    return removed;
  }

  @validate()
  unshift(...items) {
    const { schema, rawContext } = this._extractUtils(true);
    const referenceArray = rawContext[this._key] || [];
    items.forEach((item) => normalizeAndStore(this._store, item, schema));

    const ids = items.map((item) => getIdValue(item, schema));

    this._mutateContext([...ids, ...referenceArray]);

    super.unshift(...(schema.findByIds(ids, { load: this._context._load?.[this._key] }) as any));
    return this.length;
  }

  shift() {
    const { schema } = this._extractUtils();
    const removed = super.shift();
    this._mutateContext(this.map((item) => getIdValue(item, schema)));
    return removed;
  }

  @validateSplice()
  splice(...args: any[]): T[] {
    const [start, count, ...rest] = args;
    const { schema } = this._extractUtils();
    let result;
    rest.forEach((item) => normalizeAndStore(this._store, item, schema));
    result = args.length === 0 ? [] : super.splice(start, count, ...rest);
    this._mutateContext(this.map((item) => getIdValue(item, schema)));
    return result;
  }

  _mutateContext(value) {
    const { contextSchema: schema } = this._extractUtils();
    this._store.commit(`${schema._namespace}/${Mutations.SET_PROP}`, {
      id: this._context._id,
      key: this._key,
      value,
      schema,
    });
  }

  _extractUtils(withRawData = false) {
    const contextSchema = getConstructor(this._context);
    const schema: Schema = (<Relationship>contextSchema._fields[this._key]).schema;
    const rawContext = withRawData
      ? this._store.getters[`${contextSchema._namespace}/${Getters.GET_RAW}`](
        getIdValue(this._context, contextSchema),
        contextSchema
      )
      : null;
    return {
      contextSchema,
      rawContext,
      schema,
    };
  }
}

declare global {
  interface Window {
    ModelArray: any;
  }
}
window.ModelArray = ModelArray;
