<template>
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
</template>
<script lang="ts">
  import Vue from 'vue';
  import { Issue, User } from './models/User';
  import { Post } from './models/Post';


  export default Vue.extend({
    computed: {
      all() {
        return Issue.all()
      }
    },
    data() {
      return {
        issues: [],
      };
    },
    methods: {
      createIsue() {
        const issue = new Issue
        this.issues.push(issue)
      }
    },
  });
</script>
