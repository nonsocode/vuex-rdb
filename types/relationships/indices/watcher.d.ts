import { HasManyRelationship } from '../HasMany';
import { Schema } from '../../types';
import { Store } from 'vuex';
export declare class Watcher {
    protected schema: Schema;
    private store;
    private namespace;
    private name;
    interests: Set<HasManyRelationship<Schema>>;
    unwatch: Function;
    constructor(schema: Schema, store: Store<any>, namespace: string, name: string);
    addRelationship(relationship: HasManyRelationship<any>): void;
    registerWatcher(): void;
}
