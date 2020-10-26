import { Model } from './model';
import { Store } from 'vuex';
import { IdValue, Relationship } from './types';
export declare function getConstructor(model: Model): typeof Model;
export declare function normalizeAndStore(store: Store<any>, data: any, entityDef: Relationship): IdValue | IdValue[];
