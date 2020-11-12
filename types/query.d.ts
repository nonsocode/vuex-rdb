import { Model } from '.';
import { Schema } from './types';
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
    where(key: WhereKey<T>): void;
    where(key: string, value: WhereValue | WhereFunction<T>): void;
    where(key: string, operand: WhereOperand, value: WhereValue): void;
    orWhere(key: WhereKey<T>): void;
    orWhere(key: string, value: WhereValue | WhereFunction<T>): void;
    orWhere(key: string, operand: WhereOperand, value: WhereValue): void;
    private addWhere;
    abstract get(): unknown;
    protected matchItem(item: Model<unknown>): boolean;
}
export declare class ModelQuery<T extends Schema> extends Query<any> {
    private schema;
    constructor(schema: T);
    get(): InstanceType<T>[];
}
export {};
