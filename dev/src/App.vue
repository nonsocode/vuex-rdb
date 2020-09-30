<template>
  <div>
    <div>Yall playing</div>
    <button @click="createUser">ClickMe</button>
    <pre>{{ user }}</pre>
    <pre>{{ posts }}</pre>
    <pre>{{ comments }}</pre>
  </div>
</template>
<script>
  import Vue from 'vue';
  import {User} from './models/User';
  export default {
    computed: {
      user() {
        return User.find(1);
      },
      posts() {
        return this.user?.posts
      },
      comments() {
        return this.posts?.flatMap(post => post.comments) 
      }
    },
    methods: {
      createUser() {
        const u = new User();
        (u.id = 1), (u.name = 'nonso');
        u.company = 'Article';
        
        u.$save();
      }
    }
  };
</script>
