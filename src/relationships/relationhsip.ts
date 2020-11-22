import {Schema, SchemaFactory} from '../types';
import {FieldDefinition} from './field-definition';

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
export abstract class Relationship<T extends Schema = Schema, P extends Schema = Schema> extends FieldDefinition {
  constructor(private factory: SchemaFactory<T>, private parentFactory?: SchemaFactory<P>) {
    super();
  }

  get schema() {
    return this.factory();
  }

  get parentSchema() {
    return this.parentFactory?.();
  }
}

export abstract class ListLike<T extends Schema> extends Relationship<T> {
}
