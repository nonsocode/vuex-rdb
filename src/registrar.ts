import { FieldDefinition, SimpleFieldDefinition } from './relationships/field-definition';
import { createObject } from './utils';
import { Store } from 'vuex';
import Vue from 'vue';
import { Schema } from './types';

export function registerSchema(schema: Schema, store: Store<any>, namespace: string) {
  if (!schema._fields) {
    Object.defineProperty(schema, '_fields', {
      value: createObject({}),
    });
  }
  if (typeof schema.id == 'string' && !(schema.id in schema._fields)) {
    schema._fields[schema.id] = new SimpleFieldDefinition();
  }

  if (schema.fields) {
    Object.assign(schema._fields, schema.fields);
  }

  Object.defineProperties(schema, {
    _namespace: { value: namespace },
    _store: { value: store },
  });
  Object.freeze(schema);
}
