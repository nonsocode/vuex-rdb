import { schema as normalizerSchema } from 'normalizr';
import { Model } from './model';
import { getRelationshipSchema, isList } from './relationships';

type DepTree<T> = Map<typeof Model, Map<typeof Model, Set<string>>>;

export const entitySchemas: Map<typeof Model, normalizerSchema.Entity> = new Map();

export const pendingItems: DepTree<any> = new Map();

function dependOn<T, U>(dependant: typeof Model, dependee?: typeof Model, keyName?: string) {
  let innerMap: Map<typeof Model, Set<string>> = pendingItems.has(dependant) ? pendingItems.get(dependant) : new Map();
  if (dependee) {
    let keySet: Set<string> = innerMap.has(dependee) ? innerMap.get(dependee) : new Set();
    keySet.add(keyName);
    innerMap.set(dependee, keySet);
  }
  pendingItems.set(dependant, innerMap);
}

export function registerSchema<T>(schema: typeof Model) {
  if (entitySchemas.has(schema)) {
    return 'registered';
  }
  const definitions = Object.entries(schema.relationships || {});

  dependOn(schema);
  if (definitions.length) {
    definitions.forEach(([key, dependee]) => {
      dependOn(schema, isList(dependee) ? dependee[0] : dependee, key);
    });
  }
}

export function resolveCyclicDependencies() {
  pendingItems.forEach((value, dep) => cyclicResolve(dep, entitySchemas));
}

function cyclicResolve(modelSchema: typeof Model, result: Map<typeof Model, normalizerSchema.Entity>) {
  if (result.has(modelSchema)) return;

  const entity = new normalizerSchema.Entity(
    modelSchema.name,
    {},
    {
      idAttribute: modelSchema.id || 'id'
    }
  );
  result.set(modelSchema, entity);
  pendingItems.get(modelSchema).forEach((keys, dependency) => {
    cyclicResolve(dependency, result);
    keys.forEach(key => {
      const relationshipData = modelSchema.relationships[key];
      const relationshipSchema = result.get(getRelationshipSchema(relationshipData));
      const childEnt = isList(relationshipData) ? [relationshipSchema] : relationshipSchema;
      entity.define({
        [key]: childEnt
      });
    });
  });
}
