import { Model } from './model';
import { Store } from 'vuex';
import { IdValue, MixedDefinition, Schema } from './types';
import { Relationship } from './relationships/relationhsip';
export declare function getConstructor(model: Model<any>): Schema;
export declare const cacheNames: string[];
export declare const getCacheName: (isRelationship: any) => string;
export declare const parseIfLiteral: (id: any, schema: Schema) => any;
export declare function cacheDefaults(model: Model, overrides?: {}): void;
export declare function persistUnconnected(target: Model, key: string, value: any, relationship: Relationship): void;
export declare function persistConnected(
  target: Model,
  key: string,
  value: any,
  relationship: Relationship,
  schema: Schema
): void;
export declare function createAccessor(target: Model, key: any): void;
export declare function getIdValue<T>(model: T, schema: Schema): IdValue;
export declare function validateEntry(data: any, relationship: Relationship): boolean;
export declare function normalizeAndStore(
  store: Store<any>,
  data: any,
  entityDef: MixedDefinition
): IdValue | IdValue[];
export declare function modelToObject(model: Model, schema: Schema, allProps: boolean, seen?: Map<Model, object>): {};
export declare function getRecursionMessage(item: any): string;
