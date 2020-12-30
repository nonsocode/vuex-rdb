import { LoadWhereFunction, Order, OrderDirection } from '../types';
import { ContextualQuery } from './contextual-query';
import { Load } from './load';
import { getSortComparator } from './query-utils';

export class LoadQuery extends ContextualQuery<Load> {
  protected whereHasAnds: any[] = [];
  protected whereHasOrs: any[] = [];
  protected orders: Order[] = [];

  constructor(protected load: Load) {
    super();
  }

  with(relationshipName: string, queryFunction?: LoadWhereFunction): this;
  with(record: string | string[] | Record<string, LoadWhereFunction | boolean>): this;
  with(...args) {
    switch (args.length) {
      case 1:
      case 2:
        this.load.parse(args[0], args[1]);
        break;
      default:
        throw new Error('Invalid arguments supplied');
    }
    return this;
  }

  withoutRelationships() {
    if (this.load) {
      this.load.clear();
    }
    return this;
  }

  get(): any {
    throw new Error('Method not allowed');
  }

  orderBy(orders: Order[]);
  orderBy(key: string, direction: OrderDirection);
  orderBy(...args) {
    switch (args.length) {
      case 2:
        const [key, direction] = args;
        this.orders.push({ key, direction });
        break;
      case 1:
        this.orders.push(...args);
        break;
      default:
        throw new Error('invalid OrderBy Arguments');
    }
    return this;
  }

  apply(items: any) {
    if (Array.isArray(items)) {
      return this._sort(this._filter(items));
    } else if (this.matchesItem(items)) {
      return items;
    }
  }

  private _sort(items: any[]): any[] {
    if (!(this.orders.length && items.length)) return [...items];
    const comparator = getSortComparator(this.orders);
    return [...items].sort(comparator);
  }

  // whereHas(relationshipPath: string);
}
