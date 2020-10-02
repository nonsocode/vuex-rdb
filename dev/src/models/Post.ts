import { Model, Field} from '../../../dist/vuex-rdb.es';
import {Comment} from './Comment'
import { User } from './User';
export  class Post extends Model {
  static entityName = 'post';

  @Field({entity: 'user'})
  public user!: User

  @Field(['comment'])
  public comments!: Comment[]
}