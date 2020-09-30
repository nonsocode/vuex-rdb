import { normalize } from 'normalizr';
import { entitySchemas } from './registrar';
import { getRelationshipSchema, isList, relations } from './relationships';
import { identity, isFunction, mergeUnique } from './utils';
import {getIdValue, Model} from './model';
import {PluginOptions, ModelState, Mutations, Actions, Getters, EntityName, StorePath} from './types';
import {Module, Store} from 'vuex';
import Vue from 'vue';
export function generateModuleName(namespace, key) {
  namespace = namespace || '';
  const chunks = namespace.split('/');
  chunks.push(key);
  return chunks.join('/');
}

export function createModule<T>(
  schema: typeof Model,
  keyMap: Record<EntityName, StorePath>,
  options: PluginOptions<T>,
  store: Store<any>
): Module<ModelState, any> {
  const entitySchema = entitySchemas.get(schema);
  const relationKeys = Object.keys(schema.relationships || {});
  Object.defineProperties(schema, {
    _path: {
      value: keyMap[schema.entityName]
    },
    _store: {
      value: store
    }
  });
  return {
    namespaced: true,
    state: () => ({}),
    mutations: {
      [Mutations.ADD](state, { id, entity }) {
        Vue.set(state, id, {...state[id], ...entity});
      },
      [Mutations.SET_PROP](state, { id, key, value }) {
        if(state[id] == null) { throw new Error('Entity does not exist')}
        Vue.set(state[id], key, value)
        // Vue.set(state, id, {...state[id], [key]: value});
      }
    },
    actions: {
      [Actions.ADD](ctx, item) {
        const { entities, result } = normalize(item, entitySchema);
        Object.entries(entities).forEach(([entityName, entities]) => {
          Object.entries(entities).forEach(([id, entity]) => {
            if (!entity) {
              return;
            }
            ctx.commit(`${keyMap[entityName]}/${Mutations.ADD}`, { id, entity }, { root: true });
          });
        });
        return result;
      },
      [Actions.ADD_RELATED]({ state, dispatch, getters }, { id, related, data }) {
        if (!(related in schema.relationships)) {
          throw new Error(`Unknown Relationship: [${related}]`);
        }
        const item: Model = getters[Getters.FIND](id, { load: [related] });
        if (!item) {
          throw new Error("The item doesn't exist");
        }
        const relationshipDef = schema.relationships[related];

        if (isList(relationshipDef)) {
          const items = (Array.isArray(data) ? data : [data]).filter(identity);
          data = item[related] || [];
          data = mergeUnique(data.concat(items), item => getIdValue(item, getRelationshipSchema(relationshipDef)));
        }

        return dispatch(Actions.UPDATE, {
          id,
          data: {
            [related]: data
          }
        });
      },
      [Actions.REMOVE_RELATED]({ dispatch, getters }, { id, related, relatedId }) {
        if (!(related in schema.relationships)) {
          throw new Error(`Unknown Relationship: [${related}]`);
        }
        const ids = Array.isArray(id) ? id : [id];
        const items = getters[Getters.FIND_BY_IDS](ids, { load: [related] });
        if (items.length === 0) {
          console.warn('Invalid id Provided');
          return;
        }

        const relationshipDef = schema.relationships[related];
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
                }
              });
            })
          );
        } else {
          return dispatch(Actions.UPDATE, {
            id,
            data: {
              [related]: null
            }
          });
        }
      },
      [Actions.ADD_ALL]({ dispatch }, items) {
        return Promise.all(items.map(item => dispatch(Actions.ADD, item)));
      },
      [Actions.UPDATE]({ getters, dispatch }, { id, data }) {
        if (id === null || id === undefined) {
          throw new Error('Id to perform update must be defined');
        }
        const ids = Array.isArray(id) ? id : [id];
        const items = getters[Getters.FIND_BY_IDS](ids).filter(identity);
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
          const idHasChanged = oldIds.some((id, index) => id !== newIds[index]);
          if (idHasChanged) {
            throw new Error('Invalid Update: This would cause a change in the computed id.');
          }
        } else {
          const idName = schema.id;
          newItems = items.map(item => ({
            ...(isFunction(schema.id) ? item : null),
            ...data,
            [idName]: id
          }));
        }
        return dispatch(Actions.ADD_ALL, newItems);
      }
    },
    getters: {
      [Getters.GET_RAW]: (state) => id => state[id],
      [Getters.FIND]: (state, getters, rootState, rootGetters) => (id, opts: any = {}) => {
        const data = getters[Getters.GET_RAW](id);
        if (!data) {
          return;
        }
        
        return new schema(data, { connected: true });
      },
      [Getters.FIND_BY_IDS]: (state, getters) => {
        return function(ids = [], opts = {}) {
          return ids.map(id => getters[Getters.FIND](id, opts)).filter(identity);
        };
      },
      [Getters.ALL]: (state, getters) => (opts = {}) => {
        return getters[Getters.FIND_BY_IDS](Object.keys(state), opts);
      }
    }
  };
}
function relationGetters(data, key, schema, keyMap, rootGetters) {
  const relDefinition = schema.relationships[key];
  const relatedSchema = getRelationshipSchema(relDefinition);
  const getterType = isList(relDefinition) ? Getters.FIND_BY_IDS : Getters.FIND;
  const getterPath = `${keyMap[relatedSchema.entityName]}/${getterType}`;
  const getter = rootGetters[getterPath];
  let identifier = data[key];
  if ([null, undefined].includes(identifier) && isList(relDefinition)) {
    identifier = [];
  }
  return { getter, identifier };
}
