import { Where, WhereFunction, WhereKey, WhereOperand, WhereValue } from '../types';
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
