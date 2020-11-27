import { HasManyRelationship } from '../HasMany';
import { Mutations, Schema } from '../../types';
import { Store } from 'vuex';
import { createObject } from '../../utils';

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
        const index: object = concerns.reduce((obj, [entityName]) => {
          obj[entityName] = createObject();
          return obj;
        }, createObject());

        const entries = Object.entries(state[this.namespace].data[this.schema.entityName]);
        for (let [relatedId, value] of entries) {
          for (let [entityName, foreignKey] of concerns) {
            if (value[foreignKey] == null) continue;
            if (!index[entityName][value[foreignKey]]) {
              index[entityName][value[foreignKey]] = [];
            }
            index[entityName][value[foreignKey]].push(relatedId);
          }
        }
        return index;
      },
      (data) => this.store.commit(`${this.namespace}/${Mutations.SET_INDEX}`, { indexName: this.name, data })
    );
  }
}
