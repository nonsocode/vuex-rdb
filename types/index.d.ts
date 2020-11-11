import { PluginOptions } from './types';
import { Model } from './model';
import { Field } from './annotations/field';
declare function generateDatabasePlugin(options: PluginOptions): (store: any) => void;
export { Model, Field, generateDatabasePlugin };
