import {Relationship} from './relationhsip';
import {Schema, SchemaFactory} from '../types';

export class BelongsToRelationship<T extends Schema> extends Relationship {
  constructor(schemaFactory: SchemaFactory<Schema>, parentSchemaFactory: SchemaFactory<T>, public foreignKey: string) {
    super(schemaFactory, parentSchemaFactory);
  }
}
