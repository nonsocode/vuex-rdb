import { Model } from '.';
import { getIdValue } from './model';
import { Schema } from './types';
import { get, identity, isFunction, isString } from './utils';

type WhereValue = string | number | object | any[];
type WhereKey<T> = string | WhereFunction<T>;
type WhereOperand = '=' | '!=' | '>' | '<' | '>=' | '<=';
type WhereType = 'and' | 'or';
interface Where<T> {
  key: WhereKey<T>;
  operand?: WhereOperand;
  value?: WhereFunction<T> | WhereValue;
}

interface Context {
  value: any;
}
interface WhereFunction<T> {
  (query: Query<T>, item?:any): boolean | void;
}
const getComparator = <T>(item) => (where: Where<T>) => {
  if (isFunction<boolean | void>(where.key)) {
    const query = new ContextualQuery({ value: item });
    let result = where.key.call(null, query, item);
    if (typeof result == 'boolean') {
      return result;
    }
    return query.get();
  } else if (isString(where.key) && isFunction(where.value)) {
    const value = get(where.key, item);
    const query = new ContextualQuery({ value });
    const result = where.value.call(null, query, value);
    if (typeof result == 'boolean') return result;
    return query.get();
  } else if (isString(where.key) && !isFunction(where.value)) {
    const resolved = get(where.key, item);
    const isArray = Array.isArray(resolved);
    const whereValue = isArray ? resolved.length : where.value;
    switch (where.operand) {
      case '!=':
        return resolved != whereValue;
      case '>':
        return resolved > whereValue;
      case '>=':
        return resolved >= whereValue;
      case '<':
        return resolved < whereValue;
      case '<=':
        return resolved <= whereValue;
      case '=':
      default:
        return resolved == whereValue;
    }
  }
}
abstract class Query<T> {
  protected and: Where<T>[] = [];
  protected or: Where<T>[] = [];

  constructor() {}

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
    const whereArray: Where<T>[] = this[type];
    switch (args.length) {
      case 1:
        if (!isFunction<boolean | void>(args[0])) {
          throw new Error('Argument should be a function');
        }
        whereArray.push({
          key: args[0]
        });
        break;
      case 2:
        whereArray.push({
          key: args[0] as string,
          value: args[1] as WhereValue
        });
        break;
      case 3:
        whereArray.push({
          key: args[0],
          operand: args[1],
          value: args[2]
        });
        break;
      default:
        throw new Error('Illegal arguments supplied');
    }
  }

  abstract get(): unknown;

  protected matchItem(item: Model<unknown>): boolean {
    const result: boolean[] =  []
    const comparator = getComparator(item);
    result.push(!!(this.and.length && this.and.every(comparator)));
    result.push(!!(this.or.length && this.or.some(comparator)));
    return result.some(identity);
  }
}

class ContextualQuery extends Query<any> {
  constructor(private context?: Context) {
    super();
  }

  get(): boolean {
    return this.matchItem(this.context.value);
  }
}
export class ModelQuery<T extends Schema> extends Query<any> {
  constructor(private schema: T) {
    super();
  }

  get(): InstanceType<T>[] {
    const items = this.schema.all() as InstanceType<T>[];
    return items.filter(item => this.matchItem(item));
  }

  
}
