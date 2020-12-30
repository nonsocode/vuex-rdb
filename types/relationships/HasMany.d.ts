import { Schema, SchemaFactory } from '../types';
import { ListLike } from './relationhsip';
export declare class HasManyRelationship<T extends Schema> extends ListLike<T> {
    foreignKey: string;
    constructor(schemaFactory: SchemaFactory<T>, parentSchemaFactory: SchemaFactory<Schema>, foreignKey: string);
}
