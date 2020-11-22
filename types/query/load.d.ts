import { LoadWhereFunction, RelationshipModel, Schema } from '../types';
import { ContextualQuery } from './contextual-query';
import { Relationship } from '../relationships/relationhsip';
export declare class Load<S extends Schema = Schema, T extends Relationship<S> = Relationship<S>> {
    protected relationship: T;
    loads: Map<string, Load>;
    conditions: Set<ContextualQuery<T>>;
    constructor(relationship: T);
    addLoad<R extends Schema>(name: string, load: Load<R>): void;
    getLoad(name: any): Load<typeof import("..").Model, Relationship<typeof import("..").Model, typeof import("..").Model>>;
    has(name: string): boolean;
    addCondition<P extends ContextualQuery<T>>(where: P): void;
    apply(data: RelationshipModel<T>): RelationshipModel<T>;
    getRelationship(): T;
    parse(relationshipName: string, queryFunction?: LoadWhereFunction): this;
    parse(relationshipName: string | string[] | Record<string, LoadWhereFunction | true>): this;
    private parseRawLoadArgs;
}
