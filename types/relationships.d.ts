import { Relationship, Schema } from './types';
import { FieldDefinition } from './FieldDefinition';
export declare const isList: <T extends Relationship>(definition: any) => definition is T[];
export declare function getRelationshipSchema(field: FieldDefinition | Relationship): Schema;
