import { registerSchema } from './registrar';
import { createModule } from './module';
import {  PluginOptions } from './types';
import { Model } from './model';
import { Field } from './annotations/field';
const defaultPluginOptions = {
  schemas: [],
  namespace: 'database'
};
export function generateDatabasePlugin<T>(options: PluginOptions<T>) {
  const {schemas, namespace} = { ...defaultPluginOptions, ...options };
  return store => {
    store.registerModule(namespace, createModule(store));
    schemas.forEach(schema => {
      registerSchema(schema, store, namespace);
    });
    
  };
}
export { Model, Field };
