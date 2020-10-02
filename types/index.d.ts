import { PluginOptions } from './types';
import { Model } from './model';
import { Field } from './annotations/field';
export declare function generateDatabasePlugin<T>(options: PluginOptions<T>): (store: any) => void;
export { Model, Field };
