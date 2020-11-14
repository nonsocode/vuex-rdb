import { Query } from './index';
export declare class ContextualQuery<T, P extends any = any> extends Query<T> {
    private context;
    constructor(context?: any);
    matchItem(item: any): boolean;
    get(): P;
}
