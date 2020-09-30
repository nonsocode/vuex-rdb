import { schema as normalizerSchema } from 'normalizr';
import { Model } from './model';
declare type DepTree<T> = Map<typeof Model, Map<typeof Model, Set<string>>>;
export declare const entitySchemas: Map<typeof Model, normalizerSchema.Entity>;
export declare const nameModelMap: Map<string, typeof Model>;
export declare const pendingItems: DepTree<any>;
export declare function registerSchema<T>(schema: typeof Model): string;
export declare function resolveCyclicDependencies(): void;
export {};
