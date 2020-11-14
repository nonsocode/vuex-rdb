import { Relationship, Where } from '../types';
import { Load } from './load';
export declare const getComparator: <T>(item: any) => (where: Where<T>) => any;
export declare function getLoads(loads: Load[], key: string): Load<Relationship>[];
