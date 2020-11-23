import { Model } from './model';
import { Schema } from './types';
import { Store } from 'vuex';
export declare class ModelArray<T extends Model<T>> extends Array<T> {
  _context: Model;
  _key: string;
  _store: Store<any>;
  _contextSchema: Schema;
  _schema: Schema;
  constructor(...args: any[]);
  _init(context: Model, key: string, items: T[]): this;
  push(...items: any[]): number;
  pop(): T;
  unshift(...items: any[]): number;
  shift(): T;
  splice(...args: any[]): T[];
  toPlainArray(): Partial<T>[];
  _remove(items: any[]): void;
  _allForContext(): Model[];
  _mutateContext(value: any): void;
}
declare global {
  interface Window {
    ModelArray: any;
  }
}
