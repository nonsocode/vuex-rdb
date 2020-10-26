import { Model } from 'src';
import { getIdValue } from './model';
import { getRelationshipSchema } from './relationships';
import { Normalized, Relationship } from './types';
import { createObject } from './utils';

export function normalize(
  raw,
  entityDef: Relationship,
  visited = new Map<any, string | number>(),
  entities: Normalized['entities'] = new Map(),
  depth = 0
): Normalized {
  const schema = getRelationshipSchema(entityDef);
  const fields = schema._fields;
  let normalized = {};
  let result;
  if (raw == null) {
    result = null;
  } else if (Array.isArray(raw) && Array.isArray(entityDef)) {
    result = raw
      .map(r => {
        const { result } = normalize(r, schema, visited, entities, depth + 1);
        return result;
      })
      .filter(id => id != null);
  } else {
    if (visited.has(raw)) {
      result = visited.get(raw);
    } else {
      const id = getIdValue(raw, schema);
      result = id;
      visited.set(raw, id);
      for (let [key, value] of Object.entries(raw)) {
        if (key in fields) {
          normalized[key] = fields[key].isRelationship
            ? normalize(value, fields[key].entity, visited, entities, depth + 1).result
            : value;
        } else {
          // Ignore if this property isn't defined on the model
        }
      }
      if (!entities.has(schema)) {
        entities.set(schema, createObject({}));
      }
      entities.get(schema)[id] = { ...entities.get(schema)[id], ...normalized };
    }
  }

  return {
    result,
    entities
  };
}
