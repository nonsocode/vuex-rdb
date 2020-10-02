import { Model, Field } from '../../../dist/vuex-rdb.es';
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
  public name: string
  
  @Field()
  public age: number

  @Field(() => [Post])
  public posts!: Post[];

  @Field('issue')
  public issue!: Issue

}
