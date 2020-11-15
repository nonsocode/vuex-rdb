import { ModelState, Schema } from './types';
import { Module, Store } from 'vuex';
export declare function generateModuleName(namespace: any, key: any): any;
export declare function createModule<T>(store: Store<any>, schemas: Schema[]): Module<ModelState, any>;
declare global {
    interface Window {
        modelCache: any;
    }
}
