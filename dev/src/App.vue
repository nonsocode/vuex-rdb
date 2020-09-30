<template>
  <div>
    <div>Yall playing</div>
    <button @click="createUser">ClickMe</button>
    <button @click="something">ClickMe</button>
    <pre v-if="user">{{ user }}</pre>
    <!-- <pre>{{ posts }}</pre> -->
    <!-- <pre>{{ comments }}</pre> -->
  </div>
</template>
<script>
  import Vue from 'vue';
  import { User } from './models/User';
  export default {
    computed: {
      user() {
        // return User.find(1);
        return {}
      }
      // posts() {
      //   return this.user?.posts
      // },
      // comments() {
      //   return this.posts?.flatMap(post => post.comments)
      // }
    },
    data(){
      return {
        falter: {
          type: 'preview'
        }
      }
    },
    methods: {
      something() {
          this.falter.falter = this.falter
      },
      createUser() {
        const u = new User();
        (u.id = 1), (u.name = 'nonso');
        u.company = 'Article';
        u.posts = [{ id: 2, title: 'the post', comments: [{ id: 1, text: 'Chuck Norris', user: { id: 1 } }] }];

        u.$save();
      }
    }
  };
</script>
