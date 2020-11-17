import { FindOptions, IdValue, Schema } from './types';
import { Store } from 'vuex';
import { FieldDefinition } from './relationships/field-definition';
import { ModelQuery } from './query/model-query';
import { Load } from './query/load';
export declare function getIdValue<T>(model: T, schema: Schema): IdValue;
export declare class Model<T extends any = any> {
    /**
     * The namespace in the vuex store
     * @internal
     */
    static _namespace: string;
    /**
     * The name of the entity. This is similar to a table name.
     * *Note* This value doesn't have to be unique. Multiple entities can share the same table.
     */
    static entityName: string;
    /**
     * The Vuex store
     * @internal
     */
    static _store: Store<any>;
    /**
     * @internal
     */
    static _fields: Record<string, FieldDefinition>;
    /**
     * The identifier for the model. It also accepts an id resolver function that
     * receives a model-like param as input and returns the id;
     * @default 'id'
     */
    static id: string | ((...args: any[]) => IdValue);
    /**
     * Used when rendering as JSON. Useful when an enitity has a cylcic relationship.
     * It specifies exactly which relationships would be rendered out in the JSON representation
     * @internal
     */
    _load: Load;
    /**
     * When a new entity is created and not connected to the Store, it's properties
     * are kept here till `$save` method is called
     * @internal
     */
    _caches: any;
    /**
     * Indicates wether this model is connected to the store
     */
    _connected: boolean;
    /**
     * The resolved id of this model
     * @internal
     */
    _id: any;
    constructor(data?: Partial<T>, opts?: {
        load?: Load;
        connected?: boolean;
    });
    /**
     * Convert to JSON
     * @internal
     */
    toJSON(parentkey: any, parentNode: any): {};
    /**
     * Converts the model to a plain javascript object.
     */
    $toObject(allProps?: boolean): Partial<T>;
    /**
     * Update the properties of the model with the given data. You don't need to pass the full model.
     * You can pass only the props you want to update, You can also pass related models or model-like data
     */
    $update(data?: Partial<T>): Promise<IdValue>;
    /**
     * Useful when a model is created using `new Model()`.
     * You can assign properties to the model like you would any other javascript
     * object but the new values won't be saved to the vuex store until this method is called;
     *
     * If none model-like data has been assigned to the relationships on `this` model, calling save would
     * transform them to actual models
     */
    $save(): Promise<number | string>;
    /**
     * Add the given data as a relative of this entity. If the related entity is supposed to be an array,
     * and you pass a non array, it'll be auto converted to an array and appended to the existing related entities for
     * `this` model
     */
    $addRelated(related: string, data: Object): Promise<IdValue>;
    $addRelated(related: string, items: any[]): Promise<IdValue>;
    /**
     * Remove the specified entity as a relationship of `this` model
     *
     * if the `related` is a non list relationship, it's deleted from `this` model.
     *
     * if it's a list relationship, you can specify an identifier or a list of identifiers of the related
     * entities to remove as a second parameter or leave blank to remove all items
     */
    $removeRelated(related: string, id?: IdValue): Promise<IdValue>;
    $removeRelated(related: string, ids?: IdValue[]): Promise<IdValue>;
    /**
     * This is an alternative to the `Field()` decorator.
     *
     * Specify the different fields of the class
     * in an array or an object that contains the field names as it's keys
     * @deprecated
     */
    static get fields(): Record<string, FieldDefinition>;
    /**
     * Find a model by the specified identifier
     */
    static find<T extends Schema>(this: T, id: IdValue, opts?: FindOptions): InstanceType<T>;
    /**
     * Find all items that match the specified ids
     *
     */
    static findByIds<T extends Schema>(this: T, ids: any[], opts?: FindOptions): InstanceType<T>[];
    /**
     * Get all items of this type from the Database
     */
    static all<T extends Schema>(this: T, opts?: FindOptions): InstanceType<T>[];
    /**
     * Add the passed item to the database. It should match this model's schema.
     *
     * It returns a promise of the inserted entity's id
     */
    static add(item: any): Promise<IdValue>;
    /**
     * Add the passed items to the database. It should match this model's schema.
     *
     * It returns a promise of an array of ids for the inserted entities.
     */
    static addAll(items: any[]): Promise<Array<IdValue>>;
    static query<T extends Schema>(this: T, fn?: (query: ModelQuery<T>) => void): ModelQuery<T>;
}
