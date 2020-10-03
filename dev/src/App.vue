<template>
  <div>
    <button @click="createUser">Add user</button>
    <div style="display: flex;">
      <form style="display: flex; flex-direction:column" @submit.prevent="user.$save()" :key="user.id" v-for="user in users">
        <label for="id">
          <input type="text" id="id" v-model="user.id" />
        </label>
        <label for="name">
          name
          <input type="text" id="name" v-model="user.name" />
        </label>
        <label for="type">
          type
          <input type="text" id="type" v-model="user.type" />
        </label>
        <label for="age">
          user
          <input type="number" id="age" v-model.number="user.age" />
        </label>
        <button>Save</button>
        <pre>{{ user }}</pre>
      </form>
    </div>
  <div>
    All users
    <pre>{{allUsers}}</pre>
    All posts
    <pre>{{allPosts}}</pre>
  </div>
  </div>
</template>
<script lang="ts">
  import Vue from 'vue';
  import { User } from './models/User';
  import { Post } from './models/Post';


  export default Vue.extend({
    computed: {
      allUsers() {
        return User.all({load: ['posts.user.*', 'posts.comments.users']});
      },
      allPosts() {
        return Post.all({load: ['user.posts.*']})
      }
    },
    data() {
      return {
        users: [],
      };
    },
    methods: {
      createUser() {
        const u: any = new User(null,  {load: {posts:{}}});
        u.id = Math.floor(Math.random() * 10000000);
        this.users.push(u)
      }
    },
  });
</script>
