import { Model } from './model';
import { Store } from 'vuex';
import { IModelStatic } from './types';
export declare const nameModelMap: Map<string, typeof Model>;
export declare function registerSchema(schema: IModelStatic<any>, store: Store<any>, namespace: string): void;
