import { IdValue, Schema } from '../../types';
import { HasManyRelationship } from '../HasMany';
import { Watcher } from './watcher';
import { Store } from 'vuex';
export declare class Index {
    private store;
    private namespace;
    map: Map<Schema, Watcher>;
    constructor(store: Store<any>, namespace: string);
    addIndex(relationship: HasManyRelationship<Schema>): void;
    toObject(): object;
    init(): void;
    get({ schema, parentSchema }: HasManyRelationship<Schema>, parentId: IdValue): any;
}
