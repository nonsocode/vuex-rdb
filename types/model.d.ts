import {FindOptions, IModel, IModelStatic, Relationship} from './types';
import {Store} from 'vuex';
import {schema} from 'normalizr';
import SchemaFunction = schema.SchemaFunction;

export declare function getId<T>(model: T, schema: typeof Model): string | number;

export declare class Model implements IModel {
  private _options;
  static _path: string;
  static entityName: string;
  static _store: Store<any>;
  static id: string | SchemaFunction;
  _dataCache: any;
  _relationshipCache: any;
  _changes: any;

  constructor(data: any, opts?: any);

  static get relationships(): Record<string, Relationship>;

  protected get _id(): string | number;

  $update(data?: {}): Promise<string | number>;

  $save(): Promise<number | string>;

  $addRelated(related: any, data: any): Promise<string | number>;

  $fresh(): Promise<this>;

  $changes(): any;

  $resetChanges(): void;

  $removeRelated(related: any, relatedId: any): Promise<string | number>;

  static find<T>(this: IModelStatic<T>, id: string | number, opts?: FindOptions): T;

  static findByIds<T>(this: IModelStatic<T>, ids: any[], opts?: FindOptions): T[];

  static all<T>(this: IModelStatic<T>, opts?: FindOptions): T[];

  static add(item: any): Promise<string | number>;

  static addAll(items: any[]): Promise<Array<string | number>>;
}
