import { registerSchema, resolveCyclicDependencies } from './registrar';
import {createModule, generateModuleName} from './module';
import {EntityName, PluginOptions, StorePath} from './types';
import {Model} from './model';
const defaultPluginOptions = {
  schemas: [],
  namespace: 'database'
};
export function generateDatabasePlugin<T>(options: PluginOptions<T>) {
  options = { ...defaultPluginOptions, ...options };
  return store => {
    const schemaModuleNameMap: Record<EntityName, StorePath> = {};
    options.schemas.forEach(schema => {
      schemaModuleNameMap[schema.name] = generateModuleName(options.namespace, schema.name);
      registerSchema(schema);
    });

    resolveCyclicDependencies();

    const modules = {};
    options.schemas.forEach(schema => {
      modules[schema.name] = createModule(schema, schemaModuleNameMap, options, store);
    });
    if (options.namespace) {
      store.registerModule(options.namespace, {
        namespaced: true,
        modules
      });
    } else {
      Object.entries(modules).forEach(([name, mod]) => store.registerModule(name, mod));
    }
  };
}
export { Model };
