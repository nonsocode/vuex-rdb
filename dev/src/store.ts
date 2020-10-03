import Vuex, { Store } from 'vuex';
import Vue from 'vue';
import { Model, generateDatabasePlugin } from '../../dist/vuex-rdb.es';
import { User, Post, Comment, Issue } from './models';
Vue.use(Vuex);

const store =  new Vuex.Store({
  plugins: [
    generateDatabasePlugin({
      schemas: [User, Post, Comment, Issue]
    })
  ]
});
store.dispatch('database/user/add', {
  id: 1,
  name: 'nonso',
  variable: {
    prof: 'doctor',
    time: {
      foo: 'bar'
    }
  },
  posts:[
    {
      id: 5,
      title: 'frugal lord',
      user: {
        id: 1
      }
    }
  ]
})
window.User = User
window.Post = Post

export default store