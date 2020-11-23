import { Schema, SchemaFactory } from '../types';
import { ListLike, Relationship } from './relationhsip';
import { List } from '../annotations/list';

export class HasManyRelationship<T extends Schema> extends ListLike<T> {
  constructor(schemaFactory: SchemaFactory<T>, parentSchemaFactory: SchemaFactory<Schema>, public foreignKey: string) {
    super(schemaFactory, parentSchemaFactory);
  }
}
