import { Model } from '../../../dist/vuex-rdb.es';
import {Comment} from './Comment'
import { User } from './User';
export  class Post extends Model {
  static entityName = 'post';

  static get relationships() {
    return {
      comments: [Comment],
      user: User
    }
  }
}