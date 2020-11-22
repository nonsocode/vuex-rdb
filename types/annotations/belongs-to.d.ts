import { Model } from '../model';
import { Schema, SchemaFactory } from '../types';
import { BelongsToRelationship } from '../relationships/belongs-to';
export declare function BelongsTo<T extends Schema>(factory: SchemaFactory<T>, foreignKey: string): (target: Model, propName: string) => void;
export declare namespace BelongsTo {
    var define: <T extends typeof Model, P extends typeof Model>(factory: import("../types").Factory<T>, parentFactory: import("../types").Factory<P>, foreignKey: string) => BelongsToRelationship<T>;
}
