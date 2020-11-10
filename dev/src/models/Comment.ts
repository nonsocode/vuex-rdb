import { Model } from '../../../dist/vuex-rdb.es';
import {User} from './User'
import {Field} from '../../../dist/vuex-rdb.es'
export  class Comment extends Model {
  static entityName = 'comment';

  @Field(() => User)
  user: User;
}