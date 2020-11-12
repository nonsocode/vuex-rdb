import { Store } from 'vuex';
import { Schema } from './types';
export declare const nameModelMap: Map<string, Schema>;
export declare function registerSchema(schema: Schema, store: Store<any>, namespace: string): void;
