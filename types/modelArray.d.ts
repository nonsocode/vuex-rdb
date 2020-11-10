import { Model } from './model';
import { Store } from 'vuex';
export declare class ModelArray<T extends Model<T>> extends Array<T> {
    _context: Model<any>;
    _key: string;
    _store: Store<any>;
    constructor(context: Model<any>, key: string, items: T[]);
    push(...items: any[]): number;
    pop(): T;
    unshift(...items: any[]): number;
    shift(): T;
    splice(...args: any[]): T[];
    _mutateContext(value: any): void;
    _extractUtils(withRawData?: boolean): {
        ContextSchema: typeof Model;
        rawContext: any;
        Schema: typeof Model;
    };
}
declare global {
    interface Window {
        ModelArray: any;
    }
}
