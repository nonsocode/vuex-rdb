export declare type WhereValue = string | number | boolean | object | any[];
export declare type WhereKey<T> = string | WhereFunction<T>;
export declare type WhereOperand = '=' | '!=' | '>' | '<' | '>=' | '<=';
export declare type WhereType = 'and' | 'or';
export interface Where<T> {
    key: WhereKey<T>;
    operand?: WhereOperand;
    value?: WhereFunction<T> | WhereValue;
}
export interface WhereFunction<T> {
    (query: Query<T>, item?: any): boolean | void;
}
export declare abstract class Query<T> {
    protected and: Where<T>[];
    protected or: Where<T>[];
    protected constructor();
    where(key: WhereKey<T>): this;
    where(key: string, value: WhereValue | WhereFunction<T>): this;
    where(key: string, operand: WhereOperand, value: WhereValue): this;
    orWhere(key: WhereKey<T>): this;
    orWhere(key: string, value: WhereValue | WhereFunction<T>): this;
    orWhere(key: string, operand: WhereOperand, value: WhereValue): this;
    private addWhere;
    abstract get(): any;
}
