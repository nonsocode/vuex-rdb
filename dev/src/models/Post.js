import { Model } from '../../../dist/vuex-rdb.es';
import {Comment} from './Comment'
export  class Post extends Model {
  static entityName = 'post';

  static get relationships() {
    return {
      comments: [Comment]
    }
  }
}