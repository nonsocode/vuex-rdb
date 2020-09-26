import Vuex from 'vuex';
import Vue from 'vue';
import { Model, generateDatabasePlugin } from '../../dist/vuex-rdb.es';
import { User, Post, Comment } from './models';
Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [
    generateDatabasePlugin({
      schemas: [User, Post, Comment]
    })
  ]
});

window.User = User
