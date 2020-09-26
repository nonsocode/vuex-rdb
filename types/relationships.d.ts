import { Relationship } from './types';
import { Model } from './model';
export declare const isList: <T extends Relationship>(definition: any) => definition is T[];
export declare const isItem: (definition: Relationship) => Boolean;
export declare function relations(relatives: any): any;
export declare function getRelationshipSchema(relationship: Relationship): typeof Model;
