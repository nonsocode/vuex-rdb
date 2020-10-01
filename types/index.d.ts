import { PluginOptions } from './types';
import { Model } from './model';
import { Field } from './annotations/field';
import { Relationship } from './annotations/relationship';
export declare function generateDatabasePlugin<T>(options: PluginOptions<T>): (store: any) => void;
export { Model, Field, Relationship };
