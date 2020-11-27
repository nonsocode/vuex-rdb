import { LoadWhereFunction, RelationshipModel, Schema } from '../types';
import { LoadQuery } from './load-query';
import { Relationship } from '../relationships/relationhsip';
export declare class Load<S extends Schema = Schema, T extends Relationship<S> = Relationship<S>> {
  protected relationship: T;
  loads: Map<string, Load>;
  query: LoadQuery;
  constructor(relationship: T);
  addLoad<R extends Schema>(name: string, load: Load<R>): void;
  getLoad(
    name: any
  ): Load<typeof import('..').Model, Relationship<typeof import('..').Model, typeof import('..').Model>>;
  has(name: string): boolean;
  apply(data: RelationshipModel<T>): RelationshipModel<T>;
  getRelationship(): T;
  parse(relationshipName: string, queryFunction?: LoadWhereFunction): this;
  parse(relationshipName: string | string[] | Record<string, LoadWhereFunction | true>): this;
  private parseRawLoadArgs;
}
