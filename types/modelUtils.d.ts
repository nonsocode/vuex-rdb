import { Model } from './model';
import { Store } from 'vuex';
import { IdValue, MixedDefinition, Schema } from './types';
import { Rel } from './relationships/relationhsip';
export declare function getConstructor(model: Model<any>): Schema;
export declare function validateEntry(data: any, relationship: Rel): boolean;
export declare function normalizeAndStore(store: Store<any>, data: any, entityDef: MixedDefinition): IdValue | IdValue[];
export declare function modelToObject(model: Model, schema: Schema, allProps: boolean, seen?: Map<Model, object>): {};
