import { Model } from './model';
import { Store } from 'vuex';
export declare class ModelArray<T extends Model> extends Array<T> {
    _context: Model;
    _key: string;
    _store: Store<any>;
    constructor(context: Model, key: string, items: T[]);
    push(...items: any[]): number;
    _extractUtils(): void;
}
declare global {
    interface Window {
        ModelArray: any;
    }
}
