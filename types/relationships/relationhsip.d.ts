import { Schema, SchemaFactory } from '../types';
import { FieldDefinition } from './field-definition';
/**
 * The idea is to have more definitive types of relationships
 *
 * Ethe annotations could be plenty
 *
 * ```
 * class User {
 *
 *   @HasMany(() => Post, 'user_id') posts: Post[];
 *   @HasOne(() => Profile, 'user_id') profile: Profile;
 *   @List(() => Post) otherPosts: Post[];
 *   @Item(() => Address) address: Address;
 * }
 * ```
 *
 */
export declare abstract class Rel<T extends Schema = Schema> extends FieldDefinition {
    private factory;
    constructor(factory: SchemaFactory<T>);
    get schema(): T;
}
export declare abstract class ListLike<T extends Schema> extends Rel<T> {
}
