import { Model, Field} from '../../../dist/vuex-rdb.es';
import {Comment} from './Comment'
import { User } from './User';
export  class Post extends Model {
  static entityName = 'post';

  @Field(() => User)
  public user!: User

  @Field(() => [Comment])
  public comments!: Comment[]
}