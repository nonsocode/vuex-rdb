import { Normalized, Relationship } from './types';
export declare function normalize(raw: any, entityDef: Relationship, visited?: Map<any, string | number>, entities?: Normalized['entities'], depth?: number): Normalized;
