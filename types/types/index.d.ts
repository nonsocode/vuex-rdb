import { Store } from 'vuex';
import { Model } from '../model';
import { Load } from '../query/load';
import { LoadQuery } from '../query/load-query';
import { Query } from '../query/query';
import { Relationship } from '../relationships/relationhsip';
import { ItemRelationship } from '../relationships/item';
import { ListRelationship } from '../relationships/list';
export declare enum Mutations {
  ADD_ALL = 'ADD_ALL',
  PATCH_TEMPS = 'PATCH_TEMPS',
  SET_PROP = 'SET_PROP',
  SET_INDEX = 'SET_INDEX',
}
export declare enum Actions {
  ADD = 'add',
  ADD_RELATED = 'addRelated',
  REMOVE_RELATED = 'removeRelated',
  UPDATE = 'update',
}
export declare enum Getters {
  FIND = 'find',
  GET_RAW = 'getRaw',
  FIND_BY_IDS = 'findByIds',
  ALL = 'all',
  GET_INDEX = 'getIndex',
}
export declare type TypeOrFunction<T> = T | TypeFunction<T>;
export interface TypeFunction<T> extends Function {
  (this: null, data: any): T;
}
export declare type Indices = Record<string, Record<string, Record<IdValue, IdValue[]>>>;
export declare type ModelState = {
  data: Record<IdValue, any>;
  indices: Indices;
};
export declare type Cache = Map<Schema, Record<IdValue, object>>;
export declare type IdValue = string | number;
export declare type Normalized = {
  result: IdValue | IdValue[];
  entities: Cache;
};
export declare type Factory<T extends any = any> = () => T;
export declare type Schema = typeof Model;
export declare type SchemaFactory<T extends Schema> = Factory<T>;
export declare type RelationshipModel<T extends Relationship> = T extends ItemRelationship<infer U>
  ? InstanceType<U>
  : T extends ListRelationship<infer U>
  ? InstanceType<U>[]
  : never;
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
export declare type MixedDefinition = Schema | Schema[] | Relationship;
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
export declare type OrderDirection = 'desc' | 'asc';
export interface Order {
  direction: OrderDirection;
  key: string;
}
export declare type FieldDefinitionOptions =
  | {
      default?: Factory;
    }
  | Factory;
