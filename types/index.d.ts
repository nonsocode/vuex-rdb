import { PluginOptions } from './types';
import { Model } from './model';
import { Field } from './annotations/field';
import { Item } from './annotations/item';
import { List } from './annotations/list';
import { BelongsTo } from './annotations/belongs-to';
declare function generateDatabasePlugin(options: PluginOptions): (store: any) => void;
export { Model, Field, Item, List, BelongsTo, generateDatabasePlugin };
