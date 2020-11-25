import { HasManyRelationship } from '../HasMany';
import { IdValue, Mutations, Schema } from '../../types';
import { Store } from 'vuex';
import { createObject } from '../../utils';
import Vue from 'vue';

export class Watcher {
  interests: Set<HasManyRelationship<Schema>> = new Set();
  unwatch: Function;

  constructor(protected schema: Schema, private store: Store<any>, private namespace: string, private name: string) {}

  addRelationship(relationship: HasManyRelationship<any>) {
    if (relationship.schema != this.schema) {
      throw new Error('This relationship is not indexable on this watcher');
    }
    this.interests.add(relationship);
  }

  registerWatcher() {
    this.unwatch && this.unwatch();
    const concerns = [...this.interests.values()].map((rel) => [rel.parentSchema.entityName, rel.foreignKey]);

    this.unwatch = this.store.watch(
      (state) => {
        const index: object = concerns.reduce((obj, [entityName, foreignKey]) => {
          obj[entityName] = { foreignKey: foreignKey, data: createObject() };
          return obj;
        }, createObject());

        const entries = Object.entries(state[this.namespace].data[this.schema.entityName]);
        for (let [relatedId, value] of entries) {
          for (let [entityName, foreignKey] of concerns) {
            if (value[foreignKey] == null) continue;
            if (!index[entityName].data[value[foreignKey]]) {
              index[entityName].data[value[foreignKey]] = [];
            }
            index[entityName].data[value[foreignKey]].push(relatedId);
          }
        }
        return index;
      },
      (rawIndex) => {
        this.store.commit(`${this.namespace}/${Mutations.SET_INDEX}`, {
          indexName: this.name,
          data: Object.fromEntries(Object.entries(rawIndex).map(([path, data]) => [path, data.data])),
        });
      }
      // @ts-ignore

      // { immediate: true, sync: true }
    );
  }
}
