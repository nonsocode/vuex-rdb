import { MixedDefinition, Normalized } from './types';
export declare function normalize(raw: any, entityDef: MixedDefinition, visited?: Map<any, string | number>, entities?: Normalized['entities'], depth?: number): Normalized;
