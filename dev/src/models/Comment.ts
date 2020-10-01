import { Model } from '../../../dist/vuex-rdb.es';
import {User} from './User'
export  class Comment extends Model {
  static entityName = 'comment';

  static get relationships() {
    return {
      user: User
    }
  }
}