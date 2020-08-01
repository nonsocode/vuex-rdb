import { registerSchema, resolveCyclicDependencies } from './registrar';
import { createModule, generateModuleName } from './module';
import { EntityName, PluginOptions, StorePath, Model } from '@/types';

const defaultPluginOptions = {
  schemas: [],
  namespace: 'database'
};
export function generateDatabasePlugin<T>(options: PluginOptions<T>) {
  options = { ...defaultPluginOptions, ...options };
  return store => {
    const schemaModuleNameMap: Record<EntityName, StorePath> = {};
    options.schemas.forEach(schema => {
      schemaModuleNameMap[schema.entityName] = generateModuleName(options.namespace, schema.entityName);
      registerSchema(schema);
    });

    resolveCyclicDependencies();

    const modules = {};
    options.schemas.forEach(schema => {
      modules[schema.entityName] = createModule(schema, schemaModuleNameMap, options, store);
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

export { Model }
