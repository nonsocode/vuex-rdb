import { Model } from '../model';
import { Schema, SchemaFactory } from '../types';
import { ItemRelationship } from '../relationships/item';
export declare function Item<T extends Schema>(factory: SchemaFactory<T>): (target: Model, propName: string) => void;
export declare namespace Item {
    var define: <T extends typeof Model>(factory: import("../types").Factory<T>) => ItemRelationship<T>;
}
