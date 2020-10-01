import { Model, Relationship} from '../../../dist/vuex-rdb.es';
import {Comment} from './Comment'
import { User } from './User';
export  class Post extends Model {
  static entityName = 'post';

  // @Relationship(() => User)
  // public user!: User
  static get relationships() {
    return {
      comments: [Comment],
    }
  }
}