import { get, isBoolean, isFunction, isString } from '../utils';
import {ContextualQuery} from './contextual-query';
import {Where} from '../types';
import {Load} from './load';
import {Rel} from '../relationships/relationhsip';

export const getComparator = <T>(item) => (where: Where<T>) => {
  if (isFunction(where.key)) {
    const query = new ContextualQuery<any, boolean>(item);
    let result = where.key.call(null, query, item);
    if (typeof result == 'boolean') {
      return result;
    }
    return query.get();
  } else if (isString(where.key) && isFunction(where.value)) {
    const value = get(where.key, item);
    const query = new ContextualQuery(value);
    const result = where.value.call(null, query, value);
    if (typeof result == 'boolean') return result;
    return query.get();
  } else if (isBoolean(where.operand)) {
    return where.operand;
  } else if (isString(where.key) && !isFunction(where.value)) {
    let resolved = get(where.key, item);
    const isArray = Array.isArray(resolved);
    resolved = isArray ? resolved.length : resolved;

    switch (where.operand) {
      case '!=':
        return resolved != where.value;
      case '>':
        return resolved > where.value;
      case '>=':
        return resolved >= where.value;
      case '<':
        return resolved < where.value;
      case '<=':
        return resolved <= where.value;
      case '=':
      default:
        return resolved == where.value;
    }
  }
};

const addToLoads = (key: string, relationship: Rel, originalLoad: Load, newLoads: Load[]) => {
  if (originalLoad.has(key)) {
    newLoads.push(originalLoad.getLoad(key));
  } else {
    const newLoad = new Load(relationship);
    originalLoad.addLoad(key, newLoad);
    newLoads.push(newLoad);
  }
};

export function getLoads(loads: Load[], key: string) {
  const newLoads: Load[] = [];
  for (const load of loads) {
    const schema = load.getRelationship().schema;
    if (key === '*') {
      Object.entries(schema._fields)
        .filter(([, fieldDef]) => fieldDef instanceof Rel)
        .forEach(([key, value]) => {
          addToLoads(key, <Rel>value, load, newLoads);
        });
    } else if (!schema._fields[key] || !(schema._fields[key] instanceof Rel)) {
      console.warn(`[${key}] is not a relationship`);
    } else {
      addToLoads(key, <Rel>schema._fields[key], load, newLoads);
    }
  }
  return newLoads;
}
