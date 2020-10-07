<template>
<div>
  <div>
    <button @click="createIsue">Add Isue</button>
    <div style="display: flex;">
      <template  v-for="(issue, index) in issues">
      <form :key="index + 'f'" style="display: flex; flex-direction:column" @submit.prevent="issue.$save()" >
        <label for="type">
          type
          <input type="text" id="type" v-model="issue.type" />
        </label>
        <label for="entity">
          entity
          <input type="text" id="entity" v-model="issue.entity" />
        </label>
        <label for="timestamp">
          timestamp
          <input type="number" id="timestamp" v-model.number="issue.timestamp" />
        </label>
        <button>Save</button>
      </form>
      <pre :key="index + 'p'">{{issue}}</pre>
      </template>
    </div>
  <div>
    All users
    <pre>{{all}}</pre>
  </div>
  </div>
  <div>
    <button @click="createUser">Add USER</button>
    <div style="display: flex;">
      <template  v-for="(user, index) in users">
      <form :key="index + 'f'" style="display: flex; flex-direction:column" @submit.prevent="user.$save()" >
        <label for="type">
          type
          <input type="text" id="type" v-model="user.type" />
        </label>
        <label for="name">
          name
          <input type="text" id="name" v-model="user.name" />
        </label>
        <label for="age">
          age
          <input type="number" id="age" v-model.number="user.age" />
        </label>
        <button>Save</button>
      </form>
      <pre :key="index + 'p'">{{user}}</pre>
      </template>
    </div>
  <div>
    All users
    <pre>{{allUsers}}</pre>
  </div>
  </div>
</div>
</template>
<script lang="ts">
  import Vue from 'vue';
  import { Issue, User } from './models/User';
  import { Post } from './models/Post';


  export default Vue.extend({
    computed: {
      all() {
        return Issue.all()
      },
      allUsers(){
        return User.all({load: 'issues'})
      }
    },
    data() {
      return {
        issues: [],
        users: []
      };
    },
    methods: {
      createIsue() {
        const issue = new Issue
        this.issues.push(issue)
      },
      createUser(){
        const user = new User();
        user.id = Math.floor(Math.random() * 40000);
        this.users.push(user)
      }
    },
  });
</script>
