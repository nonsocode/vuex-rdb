import { FieldDefinition } from 'src/FieldDefinition';
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
  /**
   * Update the properties of the model with the given data. You don't need to pass the full model.
   * You can pass only the props you want to update, You can also pass related models or model-like data
   *
   * @param data
   */
  $update(data: any): Promise<any>;

  /**
   * Add the given data as a relative of this entity. If the related entity is supposed to be an array,
   * and you pass a non array, it'll be auto converted to an array and appended to the existing related entities for
   * `this` model
   *
   * @param related - The field of the related entity
   * @param data - The related Item(s)
   */
  $addRelated(related: string, data: Object): Promise<string | number>;
  $addRelated(related: string, items: any[]): Promise<string | number>;

  /**
   * Remove the specified entity as a relationship of `this` model
   *
   * if the `related` is a non list relationship, it's deleted from `this` model.
   *
   * if it's a list relationship, you can specify an identifier or a list of identifiers of the related
   * entities to remove as a second parameter or leave blank to remove all items
   * @param related
   * @param id
   */
  $removeRelated(related: string, id?: string | number): Promise<string | number>;
  $removeRelated(related: string, ids?: (string | number)[]): Promise<string | number>;

  /**
   * Useful when a model is created using `new Model()`.
   * You can assign properties to the model like you would any other javascript
   * object but the new values won't be saved to the vuex store until this method is called;
   *
   * If none model-like data has been assigned to the relationships on `this` model, calling save would
   * transform them to actual models
   */
  $save(): Promise<string | number>;

  [key: string]: any;
}

export type IModelStatic<T> = {
  new (data, options?: any): T;

  /**
   * The identifier for the model. It also accepts an id resolver function that
   * receives a model-like param as input and returns the id;
   * @default id
   */
  id?: string | ((...args: any[]) => string | number);

  /**
   * The name of the entity
   */
  readonly name: string;
  /**
   * This is an alternative to the `Field(() => RelatedModel)` decorator
   * 
   * A record of all the possible relationships of this Schema. Currently, two types are supported
   *
   * - list
   * - item
   *
   * lists are just Model classes in an Array while an Item is the Model Class itself
   *
   * So if we have a `UserModel` that has many `Posts`, we'd define it like so
   *
   * ```javascript
   * class UserModel extends Model {
   *   static get() {
   *     return {
   *       posts: [PostModel]
   *     }
   *   }
   * }
   * ```
   */
  relationships?: Record<string, Relationship>;

  /**
   * This is an alternative to the `Field()` decorator. 
   * 
   * Specify the different fields of the class
   * in an array or an object that contains the field names as it's keys
   */
  fields?: Record<string, true> | string[] 

  /**
   * The namespace in the vuex store
   * @internal
   */
  readonly _namespace?: string;
  /**
   * The Vuex store
   * @internal
   */
  readonly _store?: Store<any>;
  /**
   * @internal
   */
  readonly _fields?: Record<string, FieldDefinition>;
  /**
   * Find a model by the specified identifier
   * @param id
   * @param opts
   */
  find?<T>(this: IModelStatic<T>, id: string | number, opts: FindOptions): T;
  /**
   * Find all items that match the specified ids
   *
   * @param ids
   * @param opts
   */
  findByIds?<T>(this: IModelStatic<T>, ids: any[], opts: FindOptions): T[];
  /**
   * Get all items of this type from the Database
   * @param opts
   */
  all?<T>(this: IModelStatic<T>, opts: FindOptions): T[];
  /**
   * Add the passed item to the database. It should match this model's schema.
   *
   * It returns a promise of the inserted entity's id
   * @param item
   */
  add?(item: any): Promise<string | number>;
  /**
   * Add the passed items to the database. It should match this model's schema.
   *
   * It returns a promise of an array of ids for the inserted entities.
   * @param items
   */
  addAll?(items: any[]): Promise<Array<string | number>>;
};

export type Relationship = typeof Model | [typeof Model];
export type RelationshipGenerator = (() => Relationship);
export interface PluginOptions<T> {
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

export declare function generateDatabasePlugin<T>(options: PluginOptions<T>): (store: Store<any>) => any;
export type NodeTree = {
  parentNode?: NodeTree,
  item: any
}
export type ModelHooks = {
  once: {
    postSave: Function[]
  }
}