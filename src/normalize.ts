import {Model} from 'src';
import {getIdValue} from './model';
import {IdValue, MixedDefinition, Normalized, Schema} from './types';
import {createObject} from './utils';
import {ListLike, Relationship} from './relationships/relationhsip';

const listLike = (entityDef: MixedDefinition) => Array.isArray(entityDef) || entityDef instanceof ListLike;
const getRelationshipSchema = (entityDef: MixedDefinition): Schema =>
  Array.isArray(entityDef)
    ? entityDef[0]
    : (<Schema>entityDef).prototype instanceof Model
    ? <Schema>entityDef
    : entityDef instanceof Relationship
      ? (<Relationship>entityDef).schema
      : null;

export function normalize(
  raw,
  entityDef: MixedDefinition,
  visited = new Map<any, IdValue>(),
  entities: Normalized['entities'] = new Map(),
  depth = 0
): Normalized {
  const schema = getRelationshipSchema(entityDef);
  const fields = schema._fields;
  let normalized = {};
  let result;
  if (raw == null) {
    result = null;
  } else if (Array.isArray(raw) && listLike(entityDef)) {
    result = raw
      .map((r) => {
        const {result} = normalize(r, schema, visited, entities, depth + 1);
        return result;
      })
      .filter((id) => id != null);
  } else {
    if (visited.has(raw)) {
      result = visited.get(raw);
    } else {
      const id = getIdValue(raw, schema);
      result = id;
      visited.set(raw, id);
      for (let [key, value] of Object.entries(raw)) {
        if (key in fields) {
          normalized[key] =
            fields[key] instanceof Relationship
              ? normalize(value, <Relationship>fields[key], visited, entities, depth + 1).result
              : value;
        } else {
          // Ignore if this property isn't defined on the model
        }
      }
      if (!entities.has(schema)) {
        entities.set(schema, createObject());
      }
      entities.get(schema)[id] = { ...entities.get(schema)[id], ...normalized };
    }
  }

  return {
    result,
    entities,
  };
}
