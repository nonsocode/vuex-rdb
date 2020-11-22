import {Model} from 'src';
import {getIdValue} from './model';
import {IdValue, MixedDefinition, Normalized, Schema} from './types';
import {createObject} from './utils';
import {ListLike, Relationship} from './relationships/relationhsip';
import {ItemRelationship} from './relationships/item';
import {ListRelationship} from './relationships/list';
import {BelongsToRelationship} from './relationships/belongs-to';

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
      result = getIdValue(raw, schema);
      visited.set(raw, result);
      if (!entities.has(schema)) {
        entities.set(schema, createObject());
      }
      if (!entities.get(schema)[result]) {
        entities.get(schema)[result] = {};
      }
      let normalized = entities.get(schema)[result];

      for (let [key, value] of Object.entries(raw)) {
        if (!(key in fields)) continue;
        if (!(fields[key] instanceof Relationship)) {
          normalized[key] = value;
          continue;
        }
        const fieldDefinition = fields[key];
        const {result} = normalize(value, <Relationship>fields[key], visited, entities, depth + 1);
        switch (true) {
          case fieldDefinition instanceof ItemRelationship:
          case fieldDefinition instanceof ListRelationship:
            normalized[key] = result;
            break;
          case fieldDefinition instanceof BelongsToRelationship:
            const {foreignKey} = <BelongsToRelationship<Schema>>fieldDefinition;
            normalized[foreignKey] = result;
            break;
        }
      }
    }
  }

  return {
    result,
    entities,
  };
}
