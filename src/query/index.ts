import { isFunction} from "../utils";

export type WhereValue = string | number | boolean | object | any[];
export type WhereKey<T> = string | WhereFunction<T>;
export type WhereOperand = '=' | '!=' | '>' | '<' | '>=' | '<=';
export type WhereType = 'and' | 'or';

export interface Where<T> {
  key: WhereKey<T>;
  operand?: WhereOperand;
  value?: WhereFunction<T> | WhereValue;
}

export interface WhereFunction<T> {
  (query: Query<T>, item?: any): boolean | void;
}

export abstract class Query<T> {
  protected and: Where<T>[] = [];
  protected or: Where<T>[] = [];

  protected constructor() {
  }

  where(key: WhereKey<T>): this;
  where(key: string, value: WhereValue | WhereFunction<T>): this;
  where(key: string, operand: WhereOperand, value: WhereValue): this;
  where(...args) {
    this.addWhere('and', ...args);
    return this;
  }

  orWhere(key: WhereKey<T>): this;
  orWhere(key: string, value: WhereValue | WhereFunction<T>): this;
  orWhere(key: string, operand: WhereOperand, value: WhereValue): this;
  orWhere(...args) {
    this.addWhere('or', ...args);
    return this;
  }

  private addWhere(type: WhereType, ...args) {
    switch (args.length) {
      case 1:
        if (!isFunction<WhereFunction<T>>(args[0])) {
          throw new Error('Argument should be a function');
        }
        this[type].push({
          key: args[0]
        });
        break;
      case 2:
        this[type].push({
          key: args[0] as string,
          value: args[1] as WhereValue
        });
        break;
      case 3:
        this[type].push({
          key: args[0],
          operand: args[1],
          value: args[2]
        });
        break;
      default:
        throw new Error('Illegal arguments supplied');
    }
  }

  abstract get(): any;


}
