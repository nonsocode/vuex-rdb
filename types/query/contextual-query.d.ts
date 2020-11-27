import { Query } from './query';
export declare class ContextualQuery<T, P extends any = any> extends Query<T> {
  private context;
  constructor(context?: any);
  matchesItem(item: any): boolean;
  matchesSomeItems(items: any[]): boolean;
  matchesAllItems(items: any[]): boolean;
  _filter<R>(items: R[]): R[];
  get(): P;
}
