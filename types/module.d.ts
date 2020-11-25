import { ModelState, Schema } from './types';
import { Module, Store } from 'vuex';
import { Index } from './relationships/indices';
export declare function createModule<T>(store: Store<any>, schemas: Schema[], index: Index): Module<ModelState, any>;
declare global {
  interface Window {
    modelCache: any;
  }
}
