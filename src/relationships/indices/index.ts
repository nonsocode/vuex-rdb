import { Getters, IdValue, Schema } from '../../types';
import { HasManyRelationship } from '../HasMany';
import { Watcher } from './watcher';
import { Store } from 'vuex';
import { createObject } from '../../utils';

export class Index {
  map: Map<Schema, Watcher> = new Map();

  constructor(private store: Store<any>, private namespace: string) {}

  addIndex(relationship: HasManyRelationship<Schema>) {
    let watcher;
    let { schema } = relationship;
    if (!this.map.has(schema)) {
      watcher = new Watcher(schema, this.store, this.namespace, schema.entityName);
      this.map.set(schema, watcher);
    } else {
      watcher = this.map.get(schema);
    }
    watcher.addRelationship(relationship);
  }

  toObject() {
    const result = createObject();
    for (let [schema, watcher] of this.map) {
      result[schema.entityName] = createObject();
      for (let relationship of watcher.interests) {
        result[schema.entityName][relationship.parentSchema.entityName] = createObject();
      }
    }
    return result;
  }

  init() {
    for (let watcher of this.map.values()) {
      watcher.registerWatcher();
    }
  }

  get({ schema, parentSchema }: HasManyRelationship<Schema>, parentId: IdValue) {
    return this.store.getters[`${this.namespace}/${Getters.GET_INDEX}`](schema, parentSchema.entityName, parentId);
  }
}
