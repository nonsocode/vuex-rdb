import { LoadWhereFunction, Schema } from '../types';
import { LoadQuery } from './load-query';
export declare class ModelQuery<T extends Schema> extends LoadQuery {
    private schema;
    protected withArgs: any[];
    constructor(schema: T);
    with(relationshipName: string, queryFunction?: LoadWhereFunction): this;
    with(record: string[] | Record<string, LoadWhereFunction | boolean>): this;
    withoutRelationships(): this;
    private initLoad;
    get(): InstanceType<T>[];
    first(): InstanceType<T>;
}
