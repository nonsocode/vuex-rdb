import { Store } from 'vuex';
import { Model } from '../model';
import { Load } from '../query/load';
import { LoadQuery } from '../query/load-query';
import { Query } from '../query/query';
import { Relationship } from '../relationships/relationhsip';
import { ItemRelationship } from '../relationships/item';
import { ListRelationship } from '../relationships/list';
import { HasManyRelationship } from '../relationships/HasMany';

export enum Mutations {
  ADD_ALL = 'ADD_ALL',
  PATCH_TEMPS = 'PATCH_TEMPS',
  SET_PROP = 'SET_PROP',
  SET_INDEX = 'SET_INDEX',
}

export enum Actions {
  ADD = 'add',
  ADD_RELATED = 'addRelated',
  REMOVE_RELATED = 'removeRelated',
  UPDATE = 'update',
}

export enum Getters {
  FIND = 'find',
  GET_RAW = 'getRaw',
  FIND_BY_IDS = 'findByIds',
  ALL = 'all',
  GET_INDEX = 'getIndex',
}

export type TypeOrFunction<T> = T | TypeFunction<T>;

export interface TypeFunction<T> extends Function {
  (this: null, data: any): T;
}

export type Indices = Record<string, Record<string, Record<IdValue, IdValue[]>>>;
export type ModelState = { data: Record<IdValue, any>; indices: Indices };
export type Cache = Map<Schema, Record<IdValue, object>>;
export type IdValue = string | number;
export type Normalized = {
  result: IdValue | IdValue[];
  entities: Cache;
};

export type Factory<T extends any = any> = () => T;

export type Schema = typeof Model;
export type SchemaFactory<T extends Schema> = Factory<T>;
export type RelationshipModel<T extends Relationship> = T extends ItemRelationship<infer U>
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

export type MixedDefinition = Schema | Schema[] | Relationship;

export type UniFunction<T, U> = (arg: T) => U;

export type NodeTree = {
  parentNode?: NodeTree;
  item: any;
};
export type WhereValue = string | number | boolean | any[];
export type WhereKey<T> = string | WhereFunction<T>;
export type WhereOperand = '=' | '!=' | '>' | '<' | '>=' | '<=' | boolean | 'in';
export type WhereType = 'and' | 'or';

export interface Where<T> {
  key?: WhereKey<T>;
  operand?: WhereOperand;
  value?: WhereFunction<T> | UniFunction<any, boolean> | WhereValue;
}

export interface WhereFunction<T> {
  (query: Query<T>, item?: any): boolean | void;
}

export interface LoadWhereFunction {
  (query: LoadQuery): boolean | void;
}

export type OrderDirection = 'desc' | 'asc';

export interface Order {
  direction: OrderDirection;
  key: string;
}

export type FieldDefinitionOptions =
  | {
      default?: Factory;
    }
  | Factory;
