import { LoadWhereFunction, RelationshipModel, Schema, WhereFunction } from '../types';
import { createObject, isFunction, isString } from '../utils';
import { getLoads } from './query-utils';
import { ContextualQuery } from './contextual-query';
import { LoadQuery } from './load-query';
import { ListLike, Relationship } from '../relationships/relationhsip';

export class Load<S extends Schema = Schema, T extends Relationship<S> = Relationship<S>> {
  loads: Map<string, Load> = new Map();
  public query: LoadQuery;

  constructor(protected relationship: T) {}

  addLoad<R extends Schema>(name: string, load: Load<R>) {
    this.loads.set(name, load);
  }

  getLoad(name) {
    return this.loads.get(name);
  }

  clear() {
    this.loads.clear();
  }

  has(name: string): boolean {
    return this.loads.has(name);
  }

  apply(data: RelationshipModel<T>): RelationshipModel<T> {
    if (!this.query || data == null) return data;
    return this.query.apply(data as RelationshipModel<T>[]) as RelationshipModel<T>;
  }

  getRelationship(): T {
    return this.relationship;
  }

  parse(relationshipName: string, queryFunction?: LoadWhereFunction): this;
  parse(relationshipName: string | string[] | Record<string, LoadWhereFunction | true>): this;
  parse(...args): this {
    const rawLoads = this.parseRawLoadArgs(...args);

    Object.entries(rawLoads).forEach(([key, val]) => {
      const segments = key.split('.');

      const loads = segments.reduce((loads, segment) => getLoads(loads, segment), [this as Load]);
      loads.forEach((load) => {
        if (!isFunction(val)) return;
        load.query ??= new LoadQuery(load);
        val.call(null, load.query);
      });
    });
    return this;
  }

  private parseRawLoadArgs(...args): Record<string, WhereFunction<unknown> | true> {
    let rawLoads: Record<string, WhereFunction<unknown> | true> = createObject();
    const [firstArg, secondArg] = args;
    switch (args.length) {
      case 1:
        if (Array.isArray(firstArg)) {
          firstArg.forEach((item) => (rawLoads[item] = true));
        } else if (isString(firstArg)) {
          rawLoads[firstArg] = true;
        } else {
          rawLoads = createObject(firstArg);
        }
        break;
      case 2:
        rawLoads[firstArg] = secondArg;
        break;
      default:
        throw new Error('Invalid arguments supplied');
    }
    return rawLoads;
  }
}
