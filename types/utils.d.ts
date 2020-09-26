import { TypeOrFunction } from './types';
export declare const identity: (k: any) => any;
export declare function mergeUnique<K extends TypeOrFunction<string | number>>(items: Array<any>, key: K): any[];
export declare function isFunction<P extends Function>(fn: any): fn is P;
export declare function isString(string: any): string is string;
