import { schema as normalizerSchema } from 'normalizr';
import { IModelStatic } from './types';
import {getRelationshipSchema, isList} from './relationships';

type DepTree<T> = Map<IModelStatic<T>, Map<IModelStatic<T>, Set<string>>>;

export const entitySchemas: Map<IModelStatic<any>, normalizerSchema.Entity> = new Map();

export const pendingItems: DepTree<any> = new Map();

function dependOn<T, U>(dependant: IModelStatic<T>, dependee?:  IModelStatic<U>, keyName?: string) {
  let innerMap: Map<IModelStatic<U>, Set<string>> = pendingItems.has(dependant)
    ? pendingItems.get(dependant)
    : new Map();
  if (dependee) {
    let keySet: Set<string> = innerMap.has(dependee) ? innerMap.get(dependee) : new Set();
    keySet.add(keyName);
    innerMap.set(dependee, keySet);
  }
  pendingItems.set(dependant, innerMap);
}

export function registerSchema<T>(schema: IModelStatic<T>) {
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

function cyclicResolve(modelSchema: IModelStatic<any>, result: Map<IModelStatic<any>, normalizerSchema.Entity>) {
  if (result.has(modelSchema)) return;

  const entity = new normalizerSchema.Entity(
    modelSchema.entityName,
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
