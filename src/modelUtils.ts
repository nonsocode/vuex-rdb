import { Model } from './model';
import { normalize } from './normalize';
import { Store } from 'vuex';
import { nameModelMap } from './registrar';
import { IdValue, Mutations } from './types';

export function getConstructor(model: Model): typeof Model {
  return model.constructor as typeof Model;
}

export function normalizeAndStore(store: Store<any>, data: any, entityName: string | [string]): IdValue | IdValue[] {
  const { entities, result } = normalize(data, entityName);
  Object.entries(entities).forEach(([entityName, entities]) => {
    Object.entries(entities).forEach(([id, entity]) => {
      if (!entity) {
        return;
      }
      store.commit(`${nameModelMap.get(entityName)._path}/${Mutations.ADD}`, { id, entity }, { root: true });
    });
  });
  return result;
}
