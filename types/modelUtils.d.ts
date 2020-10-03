import { Model } from './model';
import { Store } from 'vuex';
import { IdValue } from './types';
export declare function getConstructor(model: Model): typeof Model;
export declare function normalizeAndStore(store: Store<any>, data: any, entityName: string | [string]): IdValue | IdValue[];
