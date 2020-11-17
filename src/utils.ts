import {IdValue, NodeTree, TypeOrFunction} from './types';

export const identity = (k) => k;

export function mergeUnique(items: Array<any>, key: TypeOrFunction<IdValue>) {
  const keyFunction: TypeOrFunction<IdValue> = isFunction(key) ? key : (item) => item[key];
  const map = new Map();
  items.forEach((item) => {
    const key = keyFunction.call(null, item);
    map.set(key, map.has(key) ? {...map.get(key), ...item} : item);
  });
  return [...map.values()];
}

export function isFunction<T extends Function>(fn: any): fn is T {
  return fn instanceof Function;
}

export function isBoolean(arg: any): arg is boolean {
  return arg === true || arg === false;
}

export function isString(string: any): string is string {
  return typeof string === 'string';
}

export function createObject<T>(object?: T): T {
  const o = Object.create(null);
  object &&
    Object.entries(object).forEach(([key, value]) => {
      o[key] = value;
    });
  return o;
}

export function ucFirst(str: string) {
  return str.charAt(0).toUpperCase() + str.substring(1);
}

export function isPrimitive(val) {
  return ['string', 'number', 'bigint', 'boolean'].includes(typeof val);
}

export const get = (path: string, obj: any, defaultVal: any = undefined) => {
  const returnable = path.split('.').reduce((acc, i) => {
    return acc === null ? undefined : acc && acc[i];
  }, obj || createObject());
  return returnable === undefined ? defaultVal : returnable;
};

export function hasSeen(item, nodeTree?: NodeTree) {
  if (!nodeTree) return false;
  while (nodeTree) {
    if (nodeTree.item == item) return true;
    nodeTree = nodeTree.parentNode;
  }
  return false;
}
