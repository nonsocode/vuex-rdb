import { isString } from './utils';
import { Relationship } from './types';
import { Model } from './model';
export const isList = <T extends Relationship>(definition: any): definition is Array<T> => Array.isArray(definition);
export const isItem = (definition: Relationship): Boolean => !isList(definition);
export function relations(relatives) {
  if ([null, undefined].includes(relatives)) {
    return {};
  } else if (!Array.isArray(relatives) && !isString(relatives)) {
    return relatives;
  }
  if (isString(relatives)) {
    relatives = [relatives];
  }
  if (Array.isArray(relatives)) {
    const result = {};
    relatives.forEach(relative => {
      let t = result;
      const paths = relative.split('.');
      for (let i = 0; i < paths.length; i++) {
        if (paths[i] === '*' || t['*']) {
          t['*'] = true;
          break;
        }
        t[paths[i]] = t[paths[i]] || {};
        t = t[paths[i]];
      }
    });
    return result;
  }
}

export function getRelationshipSchema(relationship: Relationship): typeof Model {
  return isList(relationship) ? relationship[0] : relationship;
}
