import { LoadWhereFunction, Order, OrderDirection } from '../types';
import { ContextualQuery } from './contextual-query';
import { Load } from './load';
export declare class LoadQuery extends ContextualQuery<Load> {
  protected load: Load;
  whereHasAnds: any[];
  whereHasOrs: any[];
  orders: Order[];
  constructor(load: Load);
  with(relationshipName: string, queryFunction?: LoadWhereFunction): this;
  with(record: string | string[] | Record<string, LoadWhereFunction | boolean>): this;
  get(): any;
  orderBy(orders: Order[]): any;
  orderBy(key: string, direction: OrderDirection): any;
  apply(items: any): any;
  _sort(items: any[]): any[];
}
