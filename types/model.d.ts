import { FindOptions, IModel, IModelStatic, Relationship } from './types';
import { Store } from 'vuex';
import { FieldDefinition } from './FieldDefinition';
export declare function getIdValue<T>(model: T, schema: typeof Model): string | number;
export declare class Model<T extends any = any> implements IModel {
    static _namespace: string;
    static entityName: string;
    static _store: Store<any>;
    static _fields: Record<string, FieldDefinition>;
    static id: string | ((...args: any[]) => string | number);
    _load: any;
    _caches: any;
    _connected: boolean;
    _id: any;
    constructor(data?: Partial<T>, opts?: any);
    toJSON(parentkey: any, parentNode: any): {};
    $toObject(): Partial<T>;
    $update(data?: Partial<T>): Promise<string | number>;
    $save(): Promise<number | string>;
    $addRelated(related: any, data: any): Promise<string | number>;
    $removeRelated(related: any, relatedId: any): Promise<string | number>;
    /**
     * @deprecated
     */
    static get relationships(): Record<string, Relationship>;
    static get fields(): Record<string, true> | string[];
    static find<T>(this: IModelStatic<T>, id: string | number, opts?: FindOptions): T;
    static findByIds<T>(this: IModelStatic<T>, ids: any[], opts?: FindOptions): T[];
    static all<T>(this: IModelStatic<T>, opts?: FindOptions): T[];
    static add(item: any): Promise<string | number>;
    static addAll(items: any[]): Promise<Array<string | number>>;
}
