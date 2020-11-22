import { Relationship } from './relationhsip';
import { Schema, SchemaFactory } from '../types';
export declare class BelongsToRelationship<T extends Schema> extends Relationship {
    foreignKey: string;
    constructor(schemaFactory: SchemaFactory<Schema>, parentSchemaFactory: SchemaFactory<T>, foreignKey: string);
}
