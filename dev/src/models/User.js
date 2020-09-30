import { Model } from '../../../dist/vuex-rdb.es';
import {Post} from './Post'
export  class User extends Model {
  static entityName = 'user';

  static get relationships() {
    return {
      posts: [Post]
    }
  }

  get times() {
    console.log(this)
    return this.x * this.y
  }
}
window.User = User