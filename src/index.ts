import {registerSchema} from './registrar';
import {createModule} from './module';
import {PluginOptions} from './types';
import {Model} from './model';
import {Field} from './annotations/field';
import {Item} from './annotations/item';
import {List} from './annotations/list';
import {BelongsTo} from './annotations/belongs-to';

const defaultPluginOptions = {
  schemas: [],
  namespace: 'database',
};

function generateDatabasePlugin(options: PluginOptions) {
  const {schemas, namespace} = {...defaultPluginOptions, ...options};
  return (store) => {
    store.registerModule(namespace, createModule(store, schemas));
    schemas.forEach((schema) => {
      registerSchema(schema, store, namespace);
    });
  };
}

export {Model, Field, Item, List, BelongsTo, generateDatabasePlugin};
