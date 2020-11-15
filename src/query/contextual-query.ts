import { Query } from './query';
import { getComparator } from './query-utils';
import { identity } from '../utils';

export class ContextualQuery<T, P extends any = any> extends Query<T> {
  private context: any;
  constructor(context?: any) {
    super();
    this.context = context;
  }

  matchItem(item: any): boolean {
    if (!this.and.length && !this.or.length) return true;
    const result: boolean[] = [];
    const comparator = getComparator(item);
    result.push(!!(this.and.length && this.and.every(comparator)));
    result.push(!!(this.or.length && this.or.some(comparator)));
    return result.some(identity);
  }

  get(): P {
    return this.matchItem(this.context) as any;
  }
}
