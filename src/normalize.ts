import { getIdValue } from './model';
import { nameModelMap } from './registrar';
import { createObject } from './utils';
import {normalize as normalizr, schema} from 'normalizr'

export function normalize(raw, entityName: string | [string], visited = new Map<any, string | number>(), entities = createObject({}), depth = 0) {
  const resolvedEntityName = Array.isArray(entityName) ? entityName[0] : entityName
  const schema = nameModelMap.get(resolvedEntityName);
  const fields = schema._fields;
  let normalized = {}
  let result;
  if(raw == null) {
    result = null
  } else if (Array.isArray(raw)) {
    result = raw.map(r => {
      const {result} = normalize(r, resolvedEntityName, visited, entities, depth + 1);
      return result
    }).filter(id => id != null);
  } else {
    if(visited.has(raw)) {
      result = visited.get(raw)
    } else {
      const id = getIdValue(raw, schema);
      result = id;
      visited.set(raw, id);
      for(let [key, value] of Object.entries(raw)) {
        if(key in fields && fields[key].isRelationship) {
          const {result} = normalize(value, fields[key].entity, visited, entities, depth + 1)
          normalized[key] = result
        } else {
          normalized[key] = value
        }
      }
      if(!(resolvedEntityName in entities)){
        entities[resolvedEntityName] = createObject({})
      }
      entities[resolvedEntityName][id] = {...entities[resolvedEntityName][id], ...normalized }
    }
  }

  return {
    result,
    entities
  }
}

declare global {
  interface Window {
      normalize:any;
      Schema: any;
      normalizr:any;
  }
}
window.normalize = normalize;
window.normalizr = normalizr;
window.Schema = schema;