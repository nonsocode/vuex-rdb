import { Model } from '../model';
import { Schema, SchemaFactory } from '../types';
import { createObject } from '../utils';
import { ItemRelationship } from '../relationships/item';
import { BelongsToRelationship } from '../relationships/belongs-to';
import { HasManyRelationship } from '../relationships/HasMany';

export function HasMany<T extends Schema>(factory: SchemaFactory<T>, foreignKey: string) {
  return (target: Model, propName: string): void => {
    const constructor = target.constructor as Schema;
    if (constructor._fields == null) {
      constructor._fields = createObject();
    }
    if (propName in constructor._fields) {
      return;
    }
    constructor._fields[propName] = HasMany.define(factory, () => constructor, foreignKey);
  };
}

HasMany.define = function <T extends Schema, P extends Schema>(
  factory: SchemaFactory<T>,
  parentFactory: SchemaFactory<P>,
  foreignKey: string
): HasManyRelationship<T> {
  return new HasManyRelationship(factory, parentFactory, foreignKey);
};
