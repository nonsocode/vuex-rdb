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
    store.commit(`${schema._namespace}/${Mutations.ADD_ALL}`, {schema, items}, {root: true})
  }
  return result;
}
