import { getIdValue, Model } from './model';
import { normalize } from './normalize';
import { Store } from 'vuex';
import { IdValue, MixedDefinition, Mutations, Schema } from './types';
import { FieldDefinition } from './relationships/field-definition';
import { ListLike, Relationship } from './relationships/relationhsip';

export function getConstructor(model: Model<any>): Schema {
  return model.constructor as Schema;
}

export function validateEntry(data: any, relationship: Relationship): boolean {
  const schema = relationship.schema;
  return relationship instanceof ListLike
    ? (<any[]>data).every((item) => getIdValue(item, schema) != null)
    : getIdValue(data, schema) != null;
}

export function normalizeAndStore(store: Store<any>, data: any, entityDef: MixedDefinition): IdValue | IdValue[] {
  const { entities, result } = normalize(data, entityDef);
  for (const [schema, items] of entities.entries()) {
    store.commit(`${schema._namespace}/${Mutations.ADD_ALL}`, { schema, items }, { root: true });
  }
  return result;
}

export function modelToObject(model: Model, schema: Schema, allProps: boolean, seen: Map<Model, object> = new Map()) {
  const object = {};
  seen.set(model, object);
  Object.entries(model).reduce((acc, [key, value]) => {
    if (key in schema._fields) {
      const fieldDef: FieldDefinition = schema._fields[key];
      if (fieldDef instanceof Relationship) {
        const relatedSchema = fieldDef.schema;
        if (value == null) {
          acc[key] = null;
        } else if (Array.isArray(value) && fieldDef instanceof ListLike) {
          let items = [];
          for (const item of value) {
            items.push(seen.has(item) ? seen.get(item) : modelToObject(item, relatedSchema, allProps, seen));
          }
          acc[key] = items;
        } else {
          acc[key] = seen.has(value) ? seen.get(value) : modelToObject(value, relatedSchema, allProps, seen);
        }
      } else {
        acc[key] = value;
      }
    }
    return acc;
  }, object);
  return object;
}
