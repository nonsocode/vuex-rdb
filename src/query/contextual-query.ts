import { Query } from './query';
import { getComparator } from './query-utils';
import { identity } from '../utils';

export class ContextualQuery<T, P extends any = any> extends Query<T> {
  private context: any;
  constructor(context?: any) {
    super();
    this.context = context;
  }

  matchesItem(item: any): boolean {
    if (!this.whereAnds.length && !this.whereOrs.length) return true;
    const result: boolean[] = [];
    const comparator = getComparator(item);
    result.push(!!(this.whereAnds.length && this.whereAnds.every(comparator)));
    result.push(!!(this.whereOrs.length && this.whereOrs.some(comparator)));
    return result.some(identity);
  }

  matchesSomeItems(items: any[]): boolean {
    return items.every((item) => this.matchesItem(item));
  }

  matchesAllItems(items: any[]): boolean {
    return items.some((item) => this.matchesItem(item));
  }

  _filter<R>(items: R[]): R[] {
    return items.filter((item) => this.matchesItem(item));
  }

  get(): P {
    return this.matchesItem(this.context) as any;
  }
}
