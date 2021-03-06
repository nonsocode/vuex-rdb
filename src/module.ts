import Vue from 'vue';
import { createObject, identity, isFunction, mergeUnique } from './utils';
import { Model } from './model';
import { ModelState, Mutations, Actions, Getters, Cache, Schema, FindOptions, IdValue, Indices } from './types';
import { Module, Store } from 'vuex';

import { getIdValue, normalizeAndStore } from './modelUtils';
import { Load } from './query/load';
import { ItemRelationship } from './relationships/item';
import { ListLike, Relationship } from './relationships/relationhsip';
import { Index } from './relationships/indices';

export function createModule<T>(store: Store<any>, schemas: Schema[], index: Index): Module<ModelState, any> {
  return {
    namespaced: true,
    state: () => {
      return {
        indices: index.toObject() as Indices,
        data: [...new Set(schemas.map((schema) => schema.entityName))].reduce((state, name) => {
          state[name] = {};
          return state;
        }, {}),
      };
    },
    mutations: {
      [Mutations.ADD_ALL](state, { items, schema }: { items: Cache; schema: Schema }) {
        const storeName = schema.entityName;
        state.data[storeName] = {
          ...state.data[storeName],
          ...Object.fromEntries(
            Object.entries(items).map(([id, entity]) => {
              return [
                id,
                {
                  ...state.data[storeName][id],
                  ...entity,
                },
              ];
            })
          ),
        };
      },
      [Mutations.SET_PROP](state, { id, key, value, schema }: { id: string; key: string; value: any; schema: Schema }) {
        if (state.data[schema.entityName][id] == null) {
          throw new Error('Entity does not exist');
        }
        Vue.set(state.data[schema.entityName][id], key, value);
      },
      [Mutations.SET_INDEX](state, { indexName, data }) {
        Vue.set(state.indices, indexName, data);
      },
    },
    actions: {
      [Actions.ADD](ctx, { items, schema }) {
        return normalizeAndStore(store, items, schema);
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
          newItems = items.map((item) => ({ ...item, ...data }));
          const oldIds = items.map((item) => getIdValue(item, schema));
          const newIds = newItems.map((item) => getIdValue(item, schema));
          const idHasChanged = oldIds.some((id, index) => id != newIds[index]);
          if (idHasChanged) {
            throw new Error('Invalid Update: This would cause a change in the computed id.');
          }
        } else {
          const idName = schema.id;
          newItems = items.map((item) => ({
            ...(isFunction(schema.id) ? item : null),
            ...data,
            [idName as string]: id,
          }));
        }
        return dispatch(Actions.ADD, { items: newItems, schema: [schema] });
      },
    },
    getters: {
      [Getters.GET_RAW]: (state) => (id, schema: Schema) => state.data[schema.entityName][id],
      [Getters.GET_INDEX]: (state) => (schema: Schema, path: string, id) =>
        state.indices[schema.entityName][path]?.[id] || [],
      [Getters.FIND]: (_, getters) => (id, schema: Schema, opts: FindOptions = {}) => {
        const data = getters[Getters.GET_RAW](id, schema);
        if (!data) {
          return;
        }
        let load;
        if (opts.load) {
          load = !(opts.load instanceof Load)
            ? new Load(new ItemRelationship(() => schema)).parse(opts.load)
            : opts.load;
        }
        return resolveModel(schema, data, { load, connected: true });
      },
      [Getters.FIND_BY_IDS]: (_, getters) => {
        return function (ids = [], schema: Schema, opts = {}) {
          return ids.map((id) => getters[Getters.FIND](id, schema, opts)).filter(identity);
        };
      },
      [Getters.ALL]: (state, getters) => (schema: Schema, opts = {}) => {
        return getters[Getters.FIND_BY_IDS](Object.keys(state.data[schema.entityName]), schema, opts);
      },
    },
  };
}

const modelCache: Cache = new Map();

function resolveModel(schema: Schema, rawData: object, options: { load?: Load; connected?: boolean } = {}) {
  const id = getIdValue(rawData, schema);
  if (!options.load) {
    if (!modelCache.has(schema)) {
      modelCache.set(schema, createObject());
    }
    const cache = modelCache.get(schema);
    return (cache[id] ??= new schema(rawData, options));
  } else return new schema(rawData, options);
}

declare global {
  interface Window {
    modelCache: any;
  }
}
window.modelCache = modelCache;
