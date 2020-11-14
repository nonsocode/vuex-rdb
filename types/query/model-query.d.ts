import { LoadWhereFunction, Schema } from '../types';
import { Load } from './load';
import { ContextualQuery } from "./contextual-query";
export declare class ModelQuery<T extends Schema> extends ContextualQuery<T> {
    private schema;
    load: Load<Schema>;
    withArgs: any;
    constructor(schema: T);
    with(relationshipName: string, queryFunction: LoadWhereFunction): this;
    with(record: string | string[] | Record<string, LoadWhereFunction | boolean>): this;
    private initLoad;
    private initLoadArgs;
    get(): InstanceType<T>[];
}
