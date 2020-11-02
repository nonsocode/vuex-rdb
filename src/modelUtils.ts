import { Model } from './model';
import { normalize } from './normalize';
import { Store } from 'vuex';
import { IdValue, Mutations, Relationship } from './types';

export function getConstructor(model: Model<any>): typeof Model {
  return model.constructor as typeof Model;
}

export function normalizeAndStore(store: Store<any>, data: any, entityDef: Relationship): IdValue | IdValue[] {
  const { entities, result } = normalize(data, entityDef);
  for (const [schema, items] of entities.entries()) {
    store.commit(`${schema._namespace}/${Mutations.ADD_ALL}`, {schema, items}, {root: true})
  }
  return result;
}
