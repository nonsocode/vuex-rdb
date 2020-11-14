import { Relationship, Schema } from './types';
import { FieldDefinition } from './FieldDefinition';
export const isList = <T extends Relationship>(definition: any): definition is Array<T> => Array.isArray(definition);


export function getRelationshipSchema(field: FieldDefinition | Relationship): Schema {
  if (field instanceof FieldDefinition) {
    if (!field.isRelationship) return null;
    field = field.entity;
  }
  return Array.isArray(field) ? field[0] : field;
}
