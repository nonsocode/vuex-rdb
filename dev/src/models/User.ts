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

  @Field()
  public hope!: string;

  @Relationship(() => Post)
  public post!: Post;
  
  @Relationship(() => Issue)
  public issue!: Issue
  

}
window.User = User
window.Issue = Issue