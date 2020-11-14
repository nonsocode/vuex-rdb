import { Store } from 'vuex';
import { Model } from '../model';
import { Load, LoadQuery } from '../query/load';
import { Query } from '../query/query';
export declare enum Mutations {
    ADD_ALL = "ADD_ALL",
    PATCH_TEMPS = "PATCH_TEMPS",
    SET_PROP = "SET_PROP"
}
export declare enum Actions {
    ADD = "add",
    ADD_RELATED = "addRelated",
    REMOVE_RELATED = "removeRelated",
    UPDATE = "update"
}
export declare enum Getters {
    FIND = "find",
    GET_RAW = "getRaw",
    FIND_BY_IDS = "findByIds",
    ALL = "all"
}
export declare type TypeOrFunction<T> = T | TypeFunction<T>;
export interface TypeFunction<T> extends Function {
    (this: null, data: any): T;
}
export declare type ModelState = Record<string | number, any>;
export declare type Cache = Map<Schema, Record<IdValue, object>>;
export declare type IdValue = string | number;
export declare type Normalized = {
    result: IdValue | IdValue[];
    entities: Cache;
};
export declare type Schema = typeof Model;
export declare type Relationship = Schema | [Schema];
export declare type RelationshipGenerator = () => Relationship;
export declare type RelationshipModel<T extends Relationship> = T extends typeof Model ? InstanceType<T> : T extends [typeof Model] ? InstanceType<T[0]>[] : never;
export interface PluginOptions {
    /**
     * The namespace of the database in the Vuex store
     * @default db
     */
    namespace?: string;
    /**
     * The list of Model types to be registered in the Database
     */
    schemas: Schema[];
    strict?: boolean;
}
export interface FindOptions {
    /**
     * A tree of relationships. Lets say this is the Return model and you want to get
     * the boxes as well as the outbound groups of the boxes, just specify the keys from the
     * relationship definition in a chain like so. if there are multiple definitions, put them in an array
     * `load: 'boxes.outboundGroup'`
     *
     * if you want multiple relations, put them in an array `load: ['boxes.outboundGroup', 'boxes.dispositions', 'carrierStation']`
     *
     * if you want all the toplevel relatives of the current entity use `'*'` or `['*']`
     */
    load?: string[] | string | Load | Record<string, LoadWhereFunction | true>;
}
export declare type EntityName = string;
export declare type StorePath = string;
export declare function generateDatabasePlugin<T>(options: PluginOptions): (store: Store<any>) => any;
export declare type NodeTree = {
    parentNode?: NodeTree;
    item: any;
};
export declare type WhereValue = string | number | boolean | object | any[];
export declare type WhereKey<T> = string | WhereFunction<T>;
export declare type WhereOperand = '=' | '!=' | '>' | '<' | '>=' | '<=' | boolean;
export declare type WhereType = 'and' | 'or';
export interface Where<T> {
    key?: WhereKey<T>;
    operand?: WhereOperand;
    value?: WhereFunction<T> | WhereValue;
}
export interface WhereFunction<T> {
    (query: Query<T>, item?: any): boolean | void;
}
export interface LoadWhereFunction extends WhereFunction<Load> {
    (query: LoadQuery): boolean | void;
}
