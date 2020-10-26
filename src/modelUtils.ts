import { Model } from './model';
import { normalize } from './normalize';
import { Store } from 'vuex';
import { IdValue, Mutations, Relationship } from './types';

export function getConstructor(model: Model): typeof Model {
  return model.constructor as typeof Model;
}

export function normalizeAndStore(store: Store<any>, data: any, entityDef: Relationship): IdValue | IdValue[] {
  const { entities, result } = normalize(data, entityDef);
  for (const [schema, items] of entities.entries()) {
    Object.entries(items).forEach(([id, entity]) => {
      if (!entity) {
        return;
      }
      store.commit(`${schema._namespace}/${Mutations.ADD}`, { id, entity, schema }, { root: true });
    });
  }
  return result;
}
