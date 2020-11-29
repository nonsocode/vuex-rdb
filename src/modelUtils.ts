import { Model } from './model';
import { normalize } from './normalize';
import { Store } from 'vuex';
import { Getters, IdValue, MixedDefinition, Mutations, Schema } from './types';
import { FieldDefinition } from './relationships/field-definition';
import { ListLike, Relationship } from './relationships/relationhsip';
import { HasManyRelationship } from './relationships/HasMany';
import { ModelArray } from './modelArray';
import { BelongsToRelationship } from './relationships/belongs-to';
import { identity, isFunction } from './utils';
import Vue from 'vue';

export function getConstructor(model: Model<any>): Schema {
  return model.constructor as Schema;
}

export const cacheNames = ['data', 'relationship'];
export const getCacheName = (isRelationship) => cacheNames[isRelationship ? 1 : 0];
export const parseIfLiteral = (id: any, schema: Schema): any => {
  return ['string', 'number'].includes(typeof id) ? schema.find(id) : id;
};

export function cacheDefaults(model: Model, overrides = {}) {
  Object.entries(getConstructor(model)._fields).forEach(([key, definition]) => {
    model._caches[getCacheName(definition instanceof Relationship)][key] = overrides[key] ?? definition.default;
  });
}

export function persistUnconnected(target: Model, key: string, value: any, relationship: Relationship) {
  if (relationship) {
    const Related: Schema = relationship.schema;
    value = parseIfLiteral(value, Related);
    if (relationship instanceof ListLike && value != null) {
      value = Array.isArray(value) ? value : [value].filter(identity);
    }
  }
  Vue.set(target._caches[getCacheName(!!relationship)], key, value);
}

export function persistConnected(target: Model, key: string, value: any, relationship: Relationship, schema: Schema) {
  const { _store: store, _namespace: path, id } = schema;
  if (relationship) {
    const Related: Schema = relationship.schema;
    value = parseIfLiteral(value, Related);
    if (relationship instanceof ListLike && value != null) {
      value = Array.isArray(value) ? value : [value].filter(identity);
    }
    if (value != null) {
      if (!validateEntry(value, relationship)) {
        throw new Error(`An item being assigned to the property [${key}] does not have a valid identifier`);
      }
    }
    normalizeAndStore(store, { ...target, [key]: value }, schema);
  } else {
    if (isFunction(id) || id == key) {
      const oldId = getIdValue(target, schema);
      const newId = getIdValue({ ...target, [key]: value }, schema);
      if (oldId != newId) {
        throw new Error('This update is not allowed because the resolved id is different from the original value');
      }
    }
    store.commit(`${path}/${Mutations.SET_PROP}`, { id: target._id, key, value, schema });
  }
}

export function createAccessor(target: Model, key) {
  const schema = getConstructor(target);
  const { _namespace: path, _store, _fields } = schema;
  const isRelationship = _fields[key] instanceof Relationship;
  const relationshipDef: Relationship = isRelationship ? <Relationship>_fields[key] : null;
  const load = target._load;

  Object.defineProperty(target, key, {
    enumerable: load && isRelationship ? load.has(key) : true,
    get() {
      if (target._connected) {
        if (load && isRelationship && !load.has(key)) return;
        const raw: any = _store.getters[`${path}/${Getters.GET_RAW}`](target._id, schema);
        let value = raw[key];
        if (isRelationship) {
          const opts = { load: load?.getLoad(key) };
          const Related = relationshipDef.schema;
          if (relationshipDef instanceof ListLike) {
            if (relationshipDef instanceof HasManyRelationship) {
              // Todo: index and Cache relationship keys
              value = schema.index.get(relationshipDef, this._id);
              // .all(opts)
              // .filter((item) => item[relationshipDef.foreignKey] == this._id)
              // .map((item) => getIdValue(item, relationshipDef.schema));
            }
            if (value) {
              value = Related.findByIds(value, opts);
              if (opts.load) {
                value = opts.load.apply(value);
              }
              return value && new ModelArray()._init(target, key, value);
            }
            return;
          } else if (relationshipDef instanceof BelongsToRelationship) {
            if (!raw?.[relationshipDef.foreignKey]) return;
            value = raw[relationshipDef.foreignKey];
          }
          value = Related.find(value, opts);
          return opts.load ? opts.load.apply(value) : value;
        } else {
          return raw[key];
        }
      }
      return target._caches[getCacheName(isRelationship)][key];
    },
    set(value) {
      target._connected
        ? persistConnected(target, key, value, relationshipDef, schema)
        : persistUnconnected(target, key, value, relationshipDef);
    },
  });
}

export function getIdValue<T>(model: T, schema: Schema): IdValue {
  return isFunction(schema.id) ? schema.id(model, null, null) : model[schema.id as string];
}

export function validateEntry(data: any, relationship: Relationship): boolean {
  const schema = relationship.schema;
  return relationship instanceof ListLike
    ? (<any[]>data).every((item) => getIdValue(item, schema) != null)
    : getIdValue(data, schema) != null;
}

export function normalizeAndStore(store: Store<any>, data: any, entityDef: MixedDefinition): IdValue | IdValue[] {
  const { entities, result } = normalize(data, entityDef);
  for (const [schema, items] of entities.entries()) {
    store.commit(`${schema._namespace}/${Mutations.ADD_ALL}`, { schema, items }, { root: true });
  }
  return result;
}

export function modelToObject(model: Model, schema: Schema, allProps: boolean, seen: Map<Model, object> = new Map()) {
  const object = {};
  seen.set(model, object);
  Object.entries(model).reduce((acc, [key, value]) => {
    if (key in schema._fields) {
      const fieldDef: FieldDefinition = schema._fields[key];
      if (fieldDef instanceof Relationship) {
        const relatedSchema = fieldDef.schema;
        if (value == null) {
          acc[key] = null;
        } else if (Array.isArray(value) && fieldDef instanceof ListLike) {
          let items = [];
          for (const item of value) {
            items.push(seen.has(item) ? seen.get(item) : modelToObject(item, relatedSchema, allProps, seen));
          }
          acc[key] = items;
        } else {
          acc[key] = seen.has(value) ? seen.get(value) : modelToObject(value, relatedSchema, allProps, seen);
        }
      } else {
        acc[key] = value;
      }
    }
    return acc;
  }, object);
  return object;
}

export function getRecursionMessage(item) {
  let message = '>>> Recursive item ';
  if (item instanceof Model) {
    message += `[${item.constructor.name}: ${item._id}] `;
  }
  return message + '<<<';
}
