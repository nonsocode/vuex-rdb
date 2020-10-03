import { Model, Field } from '../../../dist/vuex-rdb.es';
import { Post } from './Post';
export class Issue extends Model {
  static entityName = 'issue';
  static id(model) {
    return model.name + '#';
  }
}

export class User extends Model {
  static entityName = 'user';

  @Field()
  public name: string;

  @Field({ default: 'student' })
  public type: string;

  @Field({ default: () => Math.floor(Math.random() * 80) })
  public age: number;

  @Field({ entity: () => [Post], default: () => [] })
  public posts!: Post[];

  @Field('issue')
  public issue!: Issue;
}
