import { Relationship, RelationshipModel, Schema } from './types';
declare type WhereValue = string | number | object | any[];
declare type WhereKey<T> = string | WhereFunction<T>;
declare type WhereOperand = '=' | '!=' | '>' | '<' | '>=' | '<=';
interface Where<T> {
    key: WhereKey<T>;
    operand?: WhereOperand;
    value?: WhereFunction<T> | WhereValue;
}
interface WhereFunction<T> {
    (query: Query<T>, item?: any): boolean | void;
}
declare abstract class Query<T> {
    protected and: Where<T>[];
    protected or: Where<T>[];
    constructor();
    where(key: WhereKey<T>): this;
    where(key: string, value: WhereValue | WhereFunction<T>): this;
    where(key: string, operand: WhereOperand, value: WhereValue): this;
    orWhere(key: WhereKey<T>): this;
    orWhere(key: string, value: WhereValue | WhereFunction<T>): this;
    orWhere(key: string, operand: WhereOperand, value: WhereValue): this;
    private addWhere;
    abstract get(): unknown;
    protected matchItem(item: any): boolean;
}
export declare class ModelQuery<T extends Schema> extends Query<any> {
    private schema;
    load: Load<Schema>;
    constructor(schema: T);
    with(relationshipName: string): this;
    with(relationshipName: string, queryFunction: WhereFunction<unknown>): this;
    with(record: Record<string, WhereFunction<unknown>>): this;
    get(): InstanceType<T>[];
}
declare class Load<T extends Relationship = Relationship> {
    protected relationship: T;
    loads: Map<string, Load<Relationship>>;
    conditions: Set<Where<T>>;
    constructor(relationship: T);
    addLoad(name: string, load: Load<Relationship>): void;
    getLoad(name: any): Load<Relationship>;
    has(name: string): boolean;
    addCondition(where: Where<T>): void;
    apply(data: any): RelationshipModel<T>;
    parse(relationshipName: string, queryFunction: WhereFunction<unknown>): any;
    parse(record: Record<string, WhereFunction<unknown> | true>): any;
    parse(relationshipNames: string[]): any;
    parse(relationshipName: string): any;
    private parseRawLoadArgs;
}
export {};
