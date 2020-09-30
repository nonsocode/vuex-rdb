import { Model } from '../../../dist/vuex-rdb.es';
import {Post} from './Post'
export  class User extends Model {
  static entityName = 'user';

  static get relationships() {
    return {
      posts: [Post],
      issue: Issue
    }
  }

  get times() {
    console.log(this)
    return this.x * this.y
  }

  method() {
    console.log(this)
  }
}

export class Issue extends Model {
  static entityName = "issue"
  static  id(model) {
    return model.name + "#"
  }
}
window.User = User
window.Issue = Issue