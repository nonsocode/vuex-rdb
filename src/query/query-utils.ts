import { get, isBoolean, isFunction, isString } from '../utils';
import { ContextualQuery } from './contextual-query';
import { Order, Where } from '../types';
import { Load } from './load';
import { Relationship } from '../relationships/relationhsip';

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
    return !!where.value.call(null, value);
  } else if (isBoolean(where.operand)) {
    return where.operand;
  } else if (isString(where.key) && !isFunction(where.value)) {
    let resolved = get(where.key, item);
    const isArray = Array.isArray(resolved);
    resolved = isArray && where.operand != 'in' ? resolved.length : resolved;

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
      case 'in':
        return (<any[]>where.value).includes(resolved);
      case '=':
      default:
        return resolved == where.value;
    }
  }
};

export const getSortComparator = (orders: Order[]) => {
  const l = orders.length;
  const parsed: [string, number][] = orders.map((order) => [order.key, order.direction == 'asc' ? 1 : -1]);

  return (a, b) => {
    for (let i = 0; i < l; i++) {
      const [key, dir] = parsed[i];
      if (a[key] < b[key]) return -1 * dir;
      if (a[key] > b[key]) return dir;
    }
    return 0;
  };
};
const addToLoads = (key: string, relationship: Relationship, originalLoad: Load, newLoads: Load[]) => {
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
        .filter(([, fieldDef]) => fieldDef instanceof Relationship)
        .forEach(([key, value]) => {
          addToLoads(key, <Relationship>value, load, newLoads);
        });
    } else if (!schema._fields[key] || !(schema._fields[key] instanceof Relationship)) {
      const message = `[${key}] is not a relationship on ${schema.name}`;
      console.warn(message);
    } else {
      addToLoads(key, <Relationship>schema._fields[key], load, newLoads);
    }
  }
  return newLoads;
}
