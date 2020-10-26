import { Model, Field } from '../../../dist/vuex-rdb.es';
import { Post } from './Post';
export class Issue extends Model {
  static entityName = 'issue';

  @Field({default: () => Date.now()})
  public timestamp: number;

  @Field({default: 'broken'})
  public type: string;
  
  @Field()
  public entity: string


  static id(model) {
    return model.type + '#' + model.timestamp;
  }
}

export class User extends Model {
  static entityName = 'user';

  @Field()
  public name: string;
  
  @Field()
  public id: number;
  
  @Field()
  public prop1: string;

  @Field({ default: 'student' })
  public type: string;

  @Field({ default: () => Math.floor(Math.random() * 80) })
  public age: number;

  @Field({ entity: () => [Post], default: () => [] })
  public posts!: Post[];

  @Field(() => [Issue])
  public issues!: Issue;
}
export class User2 extends Model {
  static entityName = 'user';

  @Field()
  public name: string;
  
   @Field()
  public id: number;

  @Field({ default: 'student' })
  public type: string;

  @Field()
  public prop2: string; 

  @Field({ default: () => Math.floor(Math.random() * 80) })
  public age: number;

  @Field({ entity: () => [Post], default: () => [] })
  public posts!: Post[];

  @Field(() => [Issue])
  public issues!: Issue;
}

window.User = User;
window.User2 = User2;