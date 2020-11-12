import { Store } from 'vuex';
import { Model } from '../model';

export enum Mutations {
  ADD_ALL = 'ADD_ALL',
  PATCH_TEMPS = 'PATCH_TEMPS',
  SET_PROP = 'SET_PROP'
}

export enum Actions {
  ADD = 'add',
  ADD_RELATED = 'addRelated',
  REMOVE_RELATED = 'removeRelated',
  UPDATE = 'update'
}

export enum Getters {
  FIND = 'find',
  GET_RAW = 'getRaw',
  FIND_BY_IDS = 'findByIds',
  ALL = 'all'
}
export type TypeOrFunction<T> = T | TypeFunction<T>;
export interface TypeFunction<T> extends Function {
  (this: null, data: any): T;
}
export type ModelState = Record<string | number, any>;
export type Cache = Map<Schema, Record<IdValue, object>>;
export type IdValue = string | number;
export type Normalized = {
  result: IdValue | IdValue[];
  entities: Cache;
};

export type Schema = typeof Model

export type IModelConstructor<T> = {
  new (data: any, options?: any): T;
  _store: Store<any>;
  _namespace: string;
};

export type Relationship = Schema | [Schema];
export type RelationshipGenerator = () => Relationship;
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

type AppendRecord = { [key: string]: AppendRecord };
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
  load?: string[] | string | AppendRecord;
}
export type EntityName = string;
export type StorePath = string;

export declare function generateDatabasePlugin<T>(options: PluginOptions): (store: Store<any>) => any;
export type NodeTree = {
  parentNode?: NodeTree;
  item: any;
};
export type ModelHooks = {
  once: {
    postSave: Function[];
  };
};
