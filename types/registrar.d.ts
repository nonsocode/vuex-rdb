import { Model } from './model';
import { Store } from 'vuex';
export declare const nameModelMap: Map<string, typeof Model>;
export declare function registerSchema(schema: typeof Model, store: Store<any>, namespace: string): void;
