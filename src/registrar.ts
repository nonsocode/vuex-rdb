import { FieldDefinition } from './FieldDefinition';
import { createObject } from './utils';
import { Store } from 'vuex';
import Vue from 'vue';
import { Schema } from './types';

export const nameModelMap: Map<string, Schema> = new Map();

export function registerSchema(schema: Schema, store: Store<any>, namespace: string) {
  if (!schema._fields) {
    Object.defineProperty(schema, '_fields', {
      value: createObject({}),
    });
  }
  if (!store.state[namespace][schema.entityName]) {
    Vue.set(store.state[namespace], schema.entityName, {});
  }
  if (typeof schema.id == 'string' && !(schema.id in schema._fields)) {
    schema._fields[schema.id] = new FieldDefinition();
  }
  Object.entries(schema.relationships || {}).forEach(([key, value]) => {
    if (key in schema._fields) return;
    schema._fields[key] = new FieldDefinition({
      entity: () => value,
    });
  });
  (Array.isArray(schema.fields) ? schema.fields : Object.keys(schema.fields || {})).forEach((key) => {
    if (key in schema._fields) return;
    schema._fields[key] = new FieldDefinition();
  });

  Object.defineProperties(schema, {
    _namespace: { value: namespace },
    _store: { value: store },
  });
  Object.freeze(schema);
}
