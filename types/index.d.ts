import {PluginOptions} from './types';
import {Model} from './model';

export declare function generateDatabasePlugin<T>(options: PluginOptions<T>): (store: any) => void;

export {Model};
