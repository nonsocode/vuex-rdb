import { HasManyRelationship } from './HasMany';
import { IdValue, Schema } from '../types';
import { Store } from 'vuex';
declare type WatcherIndex = Record<string, Record<IdValue, IdValue[]>>;
declare class Watcher {
  protected schema: Schema;
  private store;
  private namespace;
  interests: Set<HasManyRelationship<Schema>>;
  index: WatcherIndex;
  unwatch: Function;
  constructor(schema: Schema, store: Store<any>, namespace: string);
  addRelationship(relationship: HasManyRelationship<any>): void;
  registerWatcher(): void;
}
export declare class Index {
  private namespace;
  map: Map<Schema, Watcher>;
  constructor(namespace: string);
  addIndex(relationship: HasManyRelationship<Schema>): void;
}
export {};
