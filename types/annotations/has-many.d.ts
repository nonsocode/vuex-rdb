import { Model } from '../model';
import { Schema, SchemaFactory } from '../types';
import { HasManyRelationship } from '../relationships/HasMany';
export declare function HasMany<T extends Schema>(factory: SchemaFactory<T>, foreignKey: string): (target: Model, propName: string) => void;
export declare namespace HasMany {
    var define: <T extends typeof Model, P extends typeof Model>(factory: import("../types").Factory<T>, parentFactory: import("../types").Factory<P>, foreignKey: string) => HasManyRelationship<T>;
}
