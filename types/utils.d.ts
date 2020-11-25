import { IdValue, NodeTree, TypeOrFunction } from './types';
export declare const identity: (k: any) => any;
export declare function mergeUnique(items: Array<any>, key: TypeOrFunction<IdValue>): any[];
export declare function isFunction<T extends Function>(fn: any): fn is T;
export declare function isBoolean(arg: any): arg is boolean;
export declare function isString(string: any): string is string;
export declare function createObject<T extends object>(object?: T): T;
export declare function ucFirst(str: string): string;
export declare function isPrimitive(val: any): boolean;
export declare const get: (path: string, obj: any, defaultVal?: any) => any;
export declare function hasSeen(item: any, nodeTree?: NodeTree): boolean;
