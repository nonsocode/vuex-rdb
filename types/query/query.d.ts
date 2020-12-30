import { UniFunction, Where, WhereFunction, WhereOperand, WhereValue } from '../types';
export declare abstract class Query<T> {
    protected whereAnds: Where<T>[];
    protected whereOrs: Where<T>[];
    protected constructor();
    where(key: string, operand: WhereOperand, value: WhereValue): this;
    where(key: string, value: UniFunction<any, boolean> | WhereValue): this;
    where(key: WhereFunction<T>): this;
    where(key: boolean): this;
    orWhere(key: string, operand: WhereOperand, value: WhereValue): this;
    orWhere(key: string, value: UniFunction<any, boolean> | WhereValue): this;
    orWhere(key: WhereFunction<T>): this;
    orWhere(key: boolean): this;
    private addWhere;
    abstract get(): any;
}
