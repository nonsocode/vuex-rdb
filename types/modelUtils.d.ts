import { Model } from './model';
import { Store } from 'vuex';
import { IdValue, Relationship } from './types';
import { FieldDefinition } from './FieldDefinition';
export declare function getConstructor(model: Model<any>): typeof Model;
export declare function validateEntry(data: any, definition: FieldDefinition): boolean;
export declare function normalizeAndStore(store: Store<any>, data: any, entityDef: Relationship): IdValue | IdValue[];
