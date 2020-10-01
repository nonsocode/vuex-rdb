import {TypeOrFunction} from './types';

export const identity = k => k;

export function mergeUnique<K extends TypeOrFunction<string | number>>(items: Array<any>, key: K) {
  const keyFunction = isFunction< string | number>(key) ? key : item => item[key];
  const map = new Map();
  items.forEach(item => {
    const key = keyFunction.call(null, item);
    map.set(key, map.has(key) ? { ...map.get(key), ...item } : item);
  });
  return [...map.values()];
}

export function isFunction<P>(fn: any): fn is (...args: any[]) => P {
  return fn instanceof Function;
}

export function isString(string: any): string is string {
  return typeof string === 'string';
}

export function createObject(object: object) {
  const o = Object.create(null);
  Object.entries(object).forEach(([key, value]) => {
    o[key] = value;
  })
  return o;
}

export function ucFirst(str: string) {
  return str.charAt(0).toUpperCase() + str.substring(1);
}