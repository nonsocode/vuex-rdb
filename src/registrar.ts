import { FieldDefinition } from './FieldDefinition';
import { Model } from './model';
import { createObject } from './utils';

export const nameModelMap: Map<string, typeof Model> = new Map();


export function registerSchema(schema: typeof Model) {
  nameModelMap.set(schema.entityName, schema);
  
  if (!schema._fields) {
    schema._fields = createObject({}) 
  }
  if(typeof schema.id == 'string' && !(schema.id in schema._fields)) {
    schema._fields[schema.id] =  new FieldDefinition().lock();
  }
  Object.entries(schema.relationships || {}).forEach(([key, value]) => {
    if (key in schema._fields) return;
    schema._fields[key] = new FieldDefinition({
      entity: Array.isArray(value) ? value[0].entityName : value.entityName,
      list: Array.isArray(value)
    }).lock();
  });
  Object.keys(schema.fields || {}).forEach((key) => {
    if (key in schema._fields) return;
    schema._fields[key] = new FieldDefinition().lock();
  });
}