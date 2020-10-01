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
  </div>
  </div>
</template>
<script lang="ts">
  import Vue from 'vue';
  import { User } from './models/User';

function logged() {
  return (target: Object, propertyName: string | symbol): void => {
    console.log('prop access', propertyName)
  }
}
function f() {
  console.log("f(): evaluated");
  return function (
    target,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    console.log("f(): called");
  };
}

function g() {
  console.log("g(): evaluated");
  return function (
    target,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    console.log("g(): called");
  };
}
class Man {
  @logged
  name: string

  @f @g
  dance(){}
}
  window.man = new Man;
  export default Vue.extend({
    computed: {
      allUsers() {
        return User.all({load: 'posts.user.posts.user.post'});
      }
    },
    data() {
      return {
        users: [],
        man: new Man
      };
    },
    methods: {
      createUser() {
        const u: any = new User();
        u.id = Math.floor(Math.random() * 10000000);
        this.users.push(u)
      }
    }
  });
window.Man = Man
</script>
