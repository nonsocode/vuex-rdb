import { LoadWhereFunction } from '../types';
import { ContextualQuery } from './contextual-query';
import { Load } from './load';
export declare class LoadQuery extends ContextualQuery<Load> {
    protected load: Load;
    constructor(load: Load);
    with(relationshipName: string, queryFunction?: LoadWhereFunction): this;
    with(record: string | string[] | Record<string, LoadWhereFunction | boolean>): this;
    get(): any;
}
