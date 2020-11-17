import { PluginOptions } from './types';
import { Model } from './model';
import { Field } from './annotations/field';
import { Item } from "./annotations/item";
import { List } from "./annotations/list";
declare function generateDatabasePlugin(options: PluginOptions): (store: any) => void;
export { Model, Field, Item, List, generateDatabasePlugin };
