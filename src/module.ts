import { getRelationshipSchema, isList, relations } from './relationships';
import { createObject, identity, isFunction, mergeUnique } from './utils';
import {getIdValue, Model} from './model';
import { ModelState, Mutations, Actions, Getters, Cache} from './types';
import {Module, Store} from 'vuex';
const sum = require('hash-sum');

import Vue from 'vue';
import { normalizeAndStore } from './modelUtils';
export function generateModuleName(namespace, key) {
  namespace = namespace || '';
  const chunks = namespace.split('/');
  chunks.push(key);
  return chunks.join('/');
}
export function createModule<T>(store: Store<any>): Module<ModelState, any> {
  
  return {
    namespaced: true,
    state: () => ({}),
    mutations: {
      [Mutations.ADD_ALL](state, { items, schema }: {items: Cache, schema: typeof Model}) {
        Object.entries(items).forEach(([id, entity]) => {
          const storeItem = state[schema.entityName][id];
          if(!storeItem) {
            return Vue.set(state[schema.entityName], id, entity)
          }
          Object.entries(entity).forEach(([key, value]) => {
            Vue.set(storeItem,key, value);
          })
        })
      },
      [Mutations.SET_PROP](state, { id, key, value, schema }: {id: string, key: string, value: any, schema: typeof Model}) {
        if(state[schema.entityName][id] == null) { throw new Error('Entity does not exist')}
        Vue.set(state[schema.entityName][id], key, value)
      }
    },
    actions: {
      [Actions.ADD](ctx, {items, schema}) {
        return normalizeAndStore(store, items, schema);
      },
      [Actions.ADD_RELATED]({ dispatch, getters }, { id, related, data, schema }) {
        if (!(related in schema._fields) && schema._fields[related].isRelationship) {
          throw new Error(`Unknown Relationship: [${related}]`);
        }
        const item: Model<any> = getters[Getters.FIND](id, { load: [related] }, schema);
        if (!item) {
          throw new Error("The item doesn't exist");
        }
        const relationshipDef = schema._fields[related];

        if (relationshipDef.isList) {
          const items = (Array.isArray(data) ? data : [data]).filter(identity);
          data = item[related] || [];
          data = mergeUnique(data.concat(items), item => getIdValue(item, getRelationshipSchema(relationshipDef)));
        }

        return dispatch(Actions.UPDATE, {
          id,
          data: {
            [related]: data
          },
          schema
        });
      },
      [Actions.REMOVE_RELATED]({ dispatch, getters }, { id, related, relatedId, schema}) {
        if (!(related in schema._fields) && schema._fields[related].isRelationship) {
          throw new Error(`Unknown Relationship: [${related}]`);
        }
        const ids = Array.isArray(id) ? id : [id];
        const items = getters[Getters.FIND_BY_IDS](ids, { load: [related] }, schema);
        if (items.length === 0) {
          console.warn('Invalid id Provided');
          return;
        }

        const relationshipDef = schema._fields[related];
        const relatedSchema = getRelationshipSchema(relationshipDef);
        if (isList(relationshipDef)) {
          const relatedIds = relatedId ? (Array.isArray(relatedId) ? relatedId : [relatedId]) : [];
          return Promise.all(
            items.map(item => {
              const relatedItems = relatedIds.length ? item[related] || [] : [];
              return dispatch(Actions.UPDATE, {
                id,
                data: {
                  [related]: relatedItems.filter(item => !relatedIds.includes(getIdValue(item, relatedSchema)))
                },
                schema
              });
            })
          );
        } else {
          return dispatch(Actions.UPDATE, {
            id,
            data: {
              [related]: null
            },
            schema
          });
        }
      },
      [Actions.UPDATE]({ getters, dispatch }, { id, data, schema }) {
        if (id === null || id === undefined) {
          throw new Error('Id to perform update must be defined');
        }
        const ids = Array.isArray(id) ? id : [id];
        const items = getters[Getters.FIND_BY_IDS](ids, schema).filter(identity);
        if (items.length !== ids.length) {
          throw new Error('Invalid item to update');
        }

        let newItems;
        if (isFunction(schema.id)) {
          // if the id definition on the model is a function, it means
          // the value is computed. We don't want an update to change the id
          // otherwise it'll break consistency
          newItems = items.map(item => ({ ...item, ...data }));
          const oldIds = items.map(item => getIdValue(item, schema));
          const newIds = newItems.map(item => getIdValue(item, schema));
          const idHasChanged = oldIds.some((id, index) => id != newIds[index]);
          if (idHasChanged) {
            throw new Error('Invalid Update: This would cause a change in the computed id.');
          }
        } else {
          const idName = schema.id;
          newItems = items.map(item => ({
            ...(isFunction(schema.id) ? item : null),
            ...data,
            [idName as string]: id
          }));
        }
        return dispatch(Actions.ADD, {items: newItems, schema: [schema]});
      }
    },
    getters: {
      [Getters.GET_RAW]: (state) => (id, schema: typeof Model) => state[schema.entityName][id],
      [Getters.FIND]: (state, getters, rootState, rootGetters) => (id, schema: typeof Model, opts: any = {} ) => {
        const data = getters[Getters.GET_RAW](id, schema);
        if (!data) {
          return;
        }
        const load = opts.load && relations(opts.load, schema._fields)
        return resolveModel(schema, data, { load, connected: true });
      },
      [Getters.FIND_BY_IDS]: (state, getters) => {
        return function(ids = [], schema: typeof Model, opts = {}) {
          return ids.map(id => getters[Getters.FIND](id, schema, opts)).filter(identity);
        };
      },
      [Getters.ALL]: (state, getters) => (schema: typeof Model, opts = {}) => {
        return getters[Getters.FIND_BY_IDS](Object.keys(state[schema.entityName]),  schema, opts);
      }
    }
  };
}

const modelCache: Cache = new Map()

function resolveModel(schema: typeof Model, rawData: object, options: any = {}) {
  const id = getIdValue(rawData, schema);
  const sumObject = {id, load: options?.load}
  const sumValue = sum(sumObject)
  if(!modelCache.has(schema)) {
    modelCache.set(schema, createObject())
  }
  const cache = modelCache.get(schema);
  return cache[sumValue] ??= new schema(rawData, options)
}

declare global {
  interface Window {
    modelCache: any
  }
}
window.modelCache = modelCache