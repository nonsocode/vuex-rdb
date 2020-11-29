import { Model } from 'src';
import { IdValue, MixedDefinition, Normalized, Schema } from './types';
import { createObject } from './utils';
import { ListLike, Relationship } from './relationships/relationhsip';
import { ItemRelationship } from './relationships/item';
import { ListRelationship } from './relationships/list';
import { BelongsToRelationship } from './relationships/belongs-to';
import { HasManyRelationship } from './relationships/HasMany';
import { getIdValue } from './modelUtils';

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
        const { result } = normalize(r, schema, visited, entities, depth + 1);
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
      let relEntries: [string, any][] = [];
      let fieldEntries: [string, any][] = [];
      let relatedResults: { key: string; value: IdValue | IdValue[]; relationship: Relationship }[] = [];
      for (let [key, value] of Object.entries(raw)) {
        if (!(key in fields)) continue;
        (fields[key] instanceof Relationship ? relEntries : fieldEntries).push([key, value]);
      }
      for (let [key, value] of relEntries) {
        const relationship: Relationship = <Relationship>fields[key];
        const { result: relatedResult } = normalize(value, relationship, visited, entities, depth + 1);
        relatedResults.push({ key, value: relatedResult, relationship });
      }
      for (let [key, value] of fieldEntries) {
        normalized[key] = value;
      }
      for (let { key, value, relationship } of relatedResults) {
        switch (true) {
          case relationship instanceof ItemRelationship:
          case relationship instanceof ListRelationship: {
            normalized[key] = value;
            break;
          }
          case relationship instanceof HasManyRelationship: {
            const { schema, foreignKey } = <HasManyRelationship<Schema>>relationship;
            (<IdValue[]>value)?.forEach((id) => {
              entities.get(schema)[id][foreignKey] = result;
            });
            break;
          }
          case relationship instanceof BelongsToRelationship: {
            const { foreignKey } = <BelongsToRelationship<Schema>>relationship;
            normalized[foreignKey] = value;
            break;
          }
        }
      }
    }
  }

  return {
    result,
    entities,
  };
}
