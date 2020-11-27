import { Order, Where } from '../types';
import { Load } from './load';
import { Relationship } from '../relationships/relationhsip';
export declare const getComparator: <T>(item: any) => (where: Where<T>) => any;
export declare const getSortComparator: (orders: Order[]) => (a: any, b: any) => number;
export declare function getLoads(
  loads: Load[],
  key: string
): Load<typeof import('..').Model, Relationship<typeof import('..').Model, typeof import('..').Model>>[];
