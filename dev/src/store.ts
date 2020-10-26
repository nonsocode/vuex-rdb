import Vuex, { Store } from 'vuex';
import Vue from 'vue';
import { Model, generateDatabasePlugin } from '../../dist/vuex-rdb.es';
import { User, Post, Comment, Issue } from './models';
import { User2 } from './models/User';
Vue.use(Vuex);

const store = new Vuex.Store({
  plugins: [
    generateDatabasePlugin({
      schemas: [User, Post, Comment, Issue, User2]
    })
  ]
});
store.dispatch('database/add', {
  item: {
    id: 1,
    name: 'nonso',
    prop1: 'this should only be visible in type 1 users',
    prop2: 'Visible to type 2',
    variable: {
      prof: 'doctor',
      time: {
        foo: 'bar'
      }
    },
    posts: [
      {
        id: 5,
        title: 'frugal lord',
        user: {
          id: 1
        }
      }
    ]
  },
  schema: User
});

export default store;
