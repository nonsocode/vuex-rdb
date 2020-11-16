import { isBoolean, isFunction } from '../utils';
import { Where, WhereFunction, WhereKey, WhereOperand, WhereType, WhereValue } from '../types';

export abstract class Query<T> {
  protected whereAnds: Where<T>[] = [];
  protected whereOrs: Where<T>[] = [];

  protected constructor() {}

  where(key: string, operand: WhereOperand, value: WhereValue): this;
  where(key: string, value: WhereValue | WhereFunction<T>): this;
  where(key: WhereFunction<T>): this;
  where(key: boolean): this;
  where(...args) {
    this.addWhere('and', ...args);
    return this;
  }

  orWhere(key: string, operand: WhereOperand, value: WhereValue): this;
  orWhere(key: string, value: WhereValue | WhereFunction<T>): this;
  orWhere(key: WhereFunction<T>): this;
  orWhere(key: boolean): this;
  orWhere(...args) {
    this.addWhere('or', ...args);
    return this;
  }

  private addWhere(type: WhereType, ...args) {
    const wheres = type == 'and' ? this.whereAnds : this.whereOrs;
    switch (args.length) {
      case 1:
        if (!isFunction<WhereFunction<T>>(args[0]) && !isBoolean(args[0])) {
          throw new Error('Argument should be a function or boolean');
        }
        if (isBoolean(args[0])) {
          wheres.push({
            operand: args[0],
          });
        } else {
          wheres.push({
            key: args[0],
          });
        }
        break;
      case 2:
        wheres.push({
          key: args[0] as string,
          value: args[1] as WhereValue | WhereFunction<T>,
        });
        break;
      case 3:
        wheres.push({
          key: args[0],
          operand: args[1],
          value: args[2],
        });
        break;
      default:
        throw new Error('Illegal arguments supplied');
    }
  }

  abstract get(): any;
}
