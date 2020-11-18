import { Where } from '../types';
import { Load } from './load';
import { Rel } from '../relationships/relationhsip';
export declare const getComparator: <T>(item: any) => (where: Where<T>) => any;
export declare function getLoads(loads: Load[], key: string): Load<typeof import("..").Model, Rel<typeof import("..").Model, typeof import("..").Model>>[];
