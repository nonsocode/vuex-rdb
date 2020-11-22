import { Model } from '../model';
import { Schema, SchemaFactory } from '../types';
import { createObject } from '../utils';
import { ItemRelationship } from '../relationships/item';

export function Item<T extends Schema>(factory: SchemaFactory<T>) {
  return (target: Model, propName: string): void => {
    const constructor = target.constructor as Schema;
    if (constructor._fields == null) {
      constructor._fields = createObject();
    }
    if (propName in constructor._fields) {
      return;
    }
    constructor._fields[propName] = Item.define(factory, () => constructor);
  };
}

Item.define = function <T extends Schema, P extends Schema>(
  factory: SchemaFactory<T>,
  parentFactory: SchemaFactory<P>
): ItemRelationship<T> {
  return new ItemRelationship(factory, parentFactory);
};
