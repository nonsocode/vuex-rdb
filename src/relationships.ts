import {createObject, isString} from './utils';
import {Relationship} from './types';
import {Model} from './model';
import { FieldDefinition } from './FieldDefinition';
import { nameModelMap } from './registrar';
export const isList = <T extends Relationship>(definition: any): definition is Array<T> => Array.isArray(definition);
export const isItem = (definition: Relationship): Boolean => !isList(definition);
export function relations(relatives, schemaFields: Record<string, FieldDefinition>) {
  if ([null, undefined].includes(relatives)) {
    return {};
  } else if (!Array.isArray(relatives) && !isString(relatives)) {
    return relatives;
  }
  if (isString(relatives)) {
    relatives = [relatives];
  }
  if (Array.isArray(relatives)) {
    const result = {};
    relatives.forEach(relative => {
      let fieldDefs: Record<string, FieldDefinition> = schemaFields;
      let t = result;
      const paths = relative.split('.');
      for (let i = 0; i < paths.length; i++) {
        if (paths[i] === '*') {
          if(fieldDefs) {
            fillRelationships(t, fieldDefs);
          }
          break;
        }
        const fieldDef = fieldDefs?.[paths[i]];
        t[paths[i]] = t[paths[i]] || createObject({});
        t = t[paths[i]];
        fieldDefs = fieldDef && getRelationshipSchema(fieldDef)._fields
      }
    });
    return result;
  }
}

function fillRelationships(t: object, fieldDefs: Record<string, FieldDefinition>) {
  Object.entries(fieldDefs).forEach(([key, def]) => {
    if(key in t || !def.isRelationship) {return}
    t[key] = createObject({})
  })
}

export function getRelationshipSchema(field: FieldDefinition | Relationship): typeof Model {
  if(field instanceof FieldDefinition) {
    if(!field.isRelationship) return null
    return field.isList ? nameModelMap.get(field.entity[0]) : nameModelMap.get(field.entity as string)
  } else {
    return Array.isArray(field) ? field[0] : field
  }
}

