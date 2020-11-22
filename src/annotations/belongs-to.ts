import { Model } from '../model';
import { Schema, SchemaFactory } from '../types';
import { createObject } from '../utils';
import { ItemRelationship } from '../relationships/item';
import { BelongsToRelationship } from '../relationships/belongs-to';

export function BelongsTo<T extends Schema>(factory: SchemaFactory<T>, foreignKey: string) {
  return (target: Model, propName: string): void => {
    const constructor = target.constructor as Schema;
    if (constructor._fields == null) {
      constructor._fields = createObject();
    }
    if (propName in constructor._fields) {
      return;
    }
    constructor._fields[propName] = BelongsTo.define(factory, () => constructor, foreignKey);
  };
}

BelongsTo.define = function <T extends Schema, P extends Schema>(
  factory: SchemaFactory<T>,
  parentFactory: SchemaFactory<P>,
  foreignKey: string
): BelongsToRelationship<T> {
  return new BelongsToRelationship(factory, parentFactory, foreignKey);
};
