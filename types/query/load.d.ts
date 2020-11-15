import { LoadWhereFunction, Relationship, RelationshipModel } from '../types';
import { ContextualQuery } from "./contextual-query";
export declare class Load<T extends Relationship = Relationship> {
    protected relationship: T;
    loads: Map<string, Load>;
    conditions: Set<ContextualQuery<T>>;
    constructor(relationship: T);
    addLoad(name: string, load: Load): void;
    getLoad(name: any): Load<Relationship>;
    has(name: string): boolean;
    addCondition<P extends ContextualQuery<T>>(where: P): void;
    apply(data: RelationshipModel<T>): RelationshipModel<T> | RelationshipModel<T>[];
    getRelationship(): T;
    parse(relationshipName: string, queryFunction?: LoadWhereFunction): this;
    parse(relationshipName: string | string[] | Record<string, LoadWhereFunction | true>): this;
    private parseRawLoadArgs;
}
