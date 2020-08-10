import {Model} from './model';
import {PluginOptions, ModelState, EntityName, StorePath} from './types';
import {Module, Store} from 'vuex';

export declare function generateModuleName(namespace: any, key: any): any;

export declare function createModule<T>(schema: typeof Model, keyMap: Record<EntityName, StorePath>, options: PluginOptions<T>, store: Store<any>): Module<ModelState, any>;
