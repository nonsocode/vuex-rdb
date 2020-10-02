import { Model, Field, Relationship } from '../../../dist/vuex-rdb.es';
import {Post} from './Post'

export class Issue extends Model {
  static entityName = "issue"
  static  id(model) {
    return model.name + "#"
  }
}
export  class User extends Model {
  static entityName = 'user';

  public hope!: string;

  public post!: Post;
  
  public issue!: Issue
  
  static get relationships() {
    return {
      posts: [Post]
    }
  }
}
window.User = User
window.Issue = Issue