import { registerSchema } from './registrar';
import { createModule } from './module';
import { PluginOptions } from './types';
import { Model } from './model';
import { Field } from './annotations/field';
import { Item } from './annotations/item';
import { List } from './annotations/list';
import { BelongsTo } from './annotations/belongs-to';
import { HasMany } from './annotations/has-many';
import { Index } from './relationships/indices';
import { HasManyRelationship } from './relationships/HasMany';
import { Plugin } from 'vuex';

const defaultPluginOptions = {
  schemas: [],
  namespace: 'database',
};

function generateDatabasePlugin(options: PluginOptions): Plugin<any> {
  const { schemas, namespace } = { ...defaultPluginOptions, ...options };
  return (store) => {
    const index = new Index(store, namespace);
    Object.defineProperty(Model, 'index', {
      value: index,
    });
    schemas.forEach((schema) => {
      registerSchema(schema, store, namespace);
      Object.values(schema._fields).forEach((definition) => {
        if (definition instanceof HasManyRelationship) index.addIndex(definition);
      });
    });
    store.registerModule(namespace, createModule(store, schemas, index));
    index.init();
  };
}

export { Model, Field, Item, List, BelongsTo, HasMany, generateDatabasePlugin };
