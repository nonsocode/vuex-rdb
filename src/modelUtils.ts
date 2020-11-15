import { getIdValue, Model } from './model';
import { normalize } from './normalize';
import { Store } from 'vuex';
import { IdValue, Mutations, Relationship, Schema } from './types';
import { FieldDefinition } from './FieldDefinition';
import { getRelationshipSchema } from './relationships';

export function getConstructor(model: Model<any>): Schema {
  return model.constructor as Schema;
}

export function validateEntry(data: any, definition: FieldDefinition): boolean {
  const relDef = getRelationshipSchema(definition);
  return definition.isList ? data.every(item => getIdValue(item, relDef) != null) : getIdValue(data, relDef) != null;
}

export function normalizeAndStore(store: Store<any>, data: any, entityDef: Relationship): IdValue | IdValue[] {
  const { entities, result } = normalize(data, entityDef);
  for (const [schema, items] of entities.entries()) {
    store.commit(`${schema._namespace}/${Mutations.ADD_ALL}`, { schema, items }, { root: true });
  }
  return result;
}

export function modelToObject(model: Model, schema: Schema, seen: Map<Model, object> = new Map()) {
  const object = {};
  seen.set(model, object);
  Object.entries(model).reduce((acc, [key, value]) => {
    if (key in schema._fields) {
      const fieldDef: FieldDefinition = schema._fields[key];
      if (fieldDef.isRelationship) {
        const relatedShema = getRelationshipSchema(fieldDef.entity);
        if (value == null) {
          acc[key] = null;
        } else if (Array.isArray(value) && fieldDef.isList) {
          acc[key] = value.map(item => (seen.has(item) ? seen.get(item) : modelToObject(item, relatedShema, seen)));
        } else {
          acc[key] = seen.has(value) ? seen.get(value) : modelToObject(value, relatedShema, seen);
        }
      } else {
        acc[key] = value;
      }
    }
    return acc;
  }, object);
  return object;
}
