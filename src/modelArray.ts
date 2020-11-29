import { Model } from './model';
import { getConstructor, getIdValue, normalizeAndStore } from './modelUtils';
import { Getters, Mutations, Schema } from './types';
import { Store } from 'vuex';
import { Relationship } from './relationships/relationhsip';
import { ListRelationship } from './relationships/list';
import { HasManyRelationship } from './relationships/HasMany';

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
      const { _schema } = this;
      validateItems(args, _schema);
      method.apply(this, args);
    };
  };
}

function validateSplice() {
  return (target, key, descriptor: PropertyDescriptor) => {
    const method: Function = descriptor.value;
    descriptor.value = function (this: ModelArray<any>, ...args) {
      const { _schema } = this;
      let [, , ...items] = args;
      items.length && validateItems(items, _schema);
      method.apply(this, args);
    };
  };
}

export class ModelArray<T extends Model<T>> extends Array<T> {
  _context: Model;
  _key: string;
  _store: Store<any>;
  _contextSchema: Schema;
  _schema: Schema;

  constructor(...args) {
    super(...args);
    Object.setPrototypeOf(this, ModelArray.prototype);
  }

  _init(context: Model, key: string, items: T[]) {
    Object.defineProperties(this, {
      _context: { value: context },
      _key: { value: key },
      _store: { value: getConstructor(context)._store },
      _contextSchema: { value: getConstructor(context) },
      _schema: { value: (<Relationship>getConstructor(context)._fields[key]).schema },
    });
    super.push.apply(this, items);
    return this;
  }

  @validate()
  push(...items) {
    normalizeAndStore(
      this._store,
      { ...this._context, [this._key]: [...this._allForContext(), ...items] },
      this._contextSchema
    );

    super.splice(0, this.length, ...this._context[this._key]);
    return this.length;
  }

  pop() {
    const removed = super.pop();
    this._remove([removed]);
    return removed;
  }

  @validate()
  unshift(...items) {
    normalizeAndStore(
      this._store,
      { ...this._context, [this._key]: [...this._allForContext(), ...items] },
      this._contextSchema
    );

    super.splice(0, this.length, ...this._context[this._key]);
    return this.length;
  }

  shift() {
    const removed = super.shift();
    this._remove([removed]);
    return removed;
  }

  @validateSplice()
  splice(...args: any[]): T[] {
    const [start, count, ...rest] = args;
    let result = args.length === 0 ? [] : super.splice(start, count, ...rest);
    this._remove(result);
    normalizeAndStore(
      this._store,
      { ...this._context, [this._key]: [...this._allForContext(), ...rest] },
      this._contextSchema
    );
    return result;
  }

  toPlainArray(): Partial<T>[] {
    return [...this].map((item) => (item instanceof Model ? item.$toObject() : item));
  }

  _remove(items: any[]) {
    if (!items.length) return;
    const {
      _schema: schema,
      _contextSchema: {
        _fields: { [this._key]: relationship },
      },
    } = this;
    const allItems = this._allForContext();
    const itemIds = items.map((item) => getIdValue(item, schema));
    switch (true) {
      case relationship instanceof ListRelationship: {
        const idsRemaining = allItems.map((item) => getIdValue(item, schema)).filter((id) => !itemIds.includes(id));
        this._mutateContext(idsRemaining);
        break;
      }
      case relationship instanceof HasManyRelationship: {
        schema
          .findByIds(itemIds)
          .forEach((item) => (item[(<HasManyRelationship<Schema>>relationship).foreignKey] = null));
        break;
      }
    }
  }

  _allForContext(): Model[] {
    return this._contextSchema.find(this._context._id)?.[this._key] || [];
  }

  _mutateContext(value) {
    this._store.commit(`${this._contextSchema._namespace}/${Mutations.SET_PROP}`, {
      id: this._context._id,
      key: this._key,
      value,
      schema: this._contextSchema,
    });
  }
}

declare global {
  interface Window {
    ModelArray: any;
  }
}
window.ModelArray = ModelArray;
