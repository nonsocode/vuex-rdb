import { Relationship, Schema } from './types';
import { FieldDefinition } from './FieldDefinition';
export declare const isList: <T extends Relationship>(definition: any) => definition is T[];
export declare const isItem: (definition: Relationship) => Boolean;
export declare function relations(relatives: any, schemaFields: Record<string, FieldDefinition>): any;
export declare function getRelationshipSchema(field: FieldDefinition | Relationship): Schema;
