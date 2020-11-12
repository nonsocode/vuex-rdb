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
  (item): boolean | void;
  (item, query: Query<T>): boolean | void;
}
const getComparator = item => where => {
  if (isFunction(where.key)) {
    const query = new ContextualQuery({ value: item });
    let result = where.key.call(null, item, query);
    if (typeof result == 'boolean') {
      return result;
    }
    return query.get();
  } else if (isString(where.key) && isFunction(where.value)) {
    const value = get(where.key, item);
    const query = new ContextualQuery({ value });
    const result = where.value.call(null, value, query);
    if (typeof result == 'boolean') return result;
    return query.get();
  } else if (isString(where.key) && !isFunction(where.value)) {
    const resolved = get(where.key, item);
    switch (where.operand) {
      case '!=':
        return resolved != where.value;
      case '>':
        return resolved > where.value;
      case '>=':
        return resolved >= where.value;
      case '<':
        return resolved < where.value;
      case '<=':
        return resolved <= where.value;
      case '=':
      default:
        return resolved != where.value;
    }
  }
}
abstract class Query<T> {
  protected ands: Where<T>[];
  protected ors: Where<T>[];

  constructor() {}

  where(key: WhereKey<T>): void;
  where(key: string, value: WhereValue | WhereFunction<T>): void;
  where(key: string, operand: WhereOperand, value: WhereValue): void;
  where(...args) {
    this.addWhere('and', ...args);
  }

  orWhere(key: WhereKey<T>): void;
  orWhere(key: string, value: WhereValue | WhereFunction<T>): void;
  orWhere(key: string, operand: WhereOperand, value: WhereValue): void;
  orWhere(...args) {
    this.addWhere('or', ...args);
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

  matchItem(item: Model<unknown>): boolean {
    const result: boolean[] =  []
    const comparator = getComparator(item);
    result.push(!!(this.ands.length && this.ands.every(comparator)));
    result.push(!!(this.ors.length && this.ors.some(comparator)));
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
export class ModelQuery<T extends Schema<T>> extends Query<any> {
  constructor(private schema: Schema<T>) {
    super();
  }

  get(): Model<T>[] {
    const items = this.schema.all();
    return items.filter(item => this.matchItem(item));
  }

  
}
