import { NodeTree, TypeOrFunction } from './types';
export declare const identity: (k: any) => any;
export declare function mergeUnique<K extends TypeOrFunction<string | number>>(items: Array<any>, key: K): any[];
export declare function isFunction<P>(fn: any): fn is (...args: any[]) => P;
export declare function isString(string: any): string is string;
export declare function createObject<T>(object?: T): T;
export declare function ucFirst(str: string): string;
export declare function isPrimitive(val: any): boolean;
export declare function hasSeen(item: any, nodeTree?: NodeTree): boolean;
