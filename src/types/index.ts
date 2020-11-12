import { FieldDefinition } from '../FieldDefinition';
import {Store} from 'vuex';
import {Model} from '../model';

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
export type ModelState = Record<string|number, any>
export type Cache =  Map<typeof Model, Record<IdValue, object>>
export type IdValue = string | number
export type Normalized = {
  result: IdValue | IdValue[],
  entities: Cache
}

export interface IModel {
  
  $update(data: any): Promise<any>;

  
  $addRelated(related: string, data: Object): Promise<string | number>;
  $addRelated(related: string, items: any[]): Promise<string | number>;

  $removeRelated(related: string, id?: string | number): Promise<string | number>;
  $removeRelated(related: string, ids?: (string | number)[]): Promise<string | number>;

  
  $save(): Promise<string | number>;

  [key: string]: any;
}

export type IModelStatic<T> = {
  new (data, options?: any): T;

  
  id?: string | ((...args: any[]) => string | number);

  
  entityName: string;
  
  relationships?: Record<string, Relationship>;

  
  fields?: Record<string, true> | string[] 

  
  readonly _namespace?: string;
  
  readonly _store?: Store<any>;
  /**
   * @internal
   */
  readonly _fields?: Record<string, FieldDefinition>;
  
  find?<T>(this: IModelStatic<T>, id: string | number, opts: FindOptions): T;
  
  findByIds?<T>(this: IModelStatic<T>, ids: any[], opts: FindOptions): T[];
  
  all?<T>(this: IModelStatic<T>, opts: FindOptions): T[];
  
  add?(item: any): Promise<string | number>;
  
  addAll?(items: any[]): Promise<Array<string | number>>;
};

export type Relationship = typeof Model | [typeof Model];
export type RelationshipGenerator = (() => Relationship);
export interface PluginOptions {
  /**
   * The namespace of the database in the Vuex store
   * @default db
   */
  namespace?: string;
  /**
   * The list of Model types to be registered in the Database
   */
  schemas: typeof Model[];
  
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
  parentNode?: NodeTree,
  item: any
}
export type ModelHooks = {
  once: {
    postSave: Function[]
  }
}