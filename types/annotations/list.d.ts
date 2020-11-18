import { Model } from '../model';
import { Schema, SchemaFactory } from '../types';
import { ListRelationship } from '../relationships/list';
export declare function List<T extends Schema>(factory: SchemaFactory<T>): (target: Model, propName: string, other?: any) => void;
export declare namespace List {
    var define: <T extends typeof Model, P extends typeof Model>(factory: import("../types").Factory<T>, parentFactory: import("../types").Factory<P>) => ListRelationship<T>;
}
