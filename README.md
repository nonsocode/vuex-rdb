# vuex-rdb

An Active Record database for [Vuex](https://vuex.vuejs.org/). Define data models with relationships and query them directly from your Vuex store — without the boilerplate.

## Table of Contents

- [Installation](#installation)
- [Setup](#setup)
- [Defining Models](#defining-models)
  - [Fields](#fields)
  - [Relationships](#relationships)
- [Working with Data](#working-with-data)
  - [Adding data](#adding-data)
  - [Finding data](#finding-data)
  - [Updating data](#updating-data)
  - [Creating instances with `new`](#creating-instances-with-new)
- [Querying](#querying)
  - [Filtering](#filtering)
  - [Sorting](#sorting)
  - [Eager loading relationships](#eager-loading-relationships)
- [TypeScript Configuration](#typescript-configuration)
- [License](#license)

---

## Installation

```bash
npm install vuex-rdb
# or
yarn add vuex-rdb
```

**Peer dependencies** — make sure these are also installed:

```bash
npm install vue@^2.6.0 vuex@^3.3.0
```

---

## Setup

Register the plugin when creating your Vuex store, passing in an array of all the model schemas you want to use:

```js
import Vue from 'vue'
import Vuex from 'vuex'
import { generateDatabasePlugin } from 'vuex-rdb'
import { User, Post, Comment } from './models'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [
    generateDatabasePlugin({
      schemas: [User, Post, Comment],
      namespace: 'database', // optional, defaults to 'database'
    }),
  ],
})
```

| Option      | Type      | Default      | Description                                     |
| ----------- | --------- | ------------ | ----------------------------------------------- |
| `schemas`   | `Model[]` | `[]`         | All model classes to register with the plugin   |
| `namespace` | `string`  | `'database'` | The Vuex module namespace used internally       |

---

## Defining Models

Extend the `Model` base class and use decorators to declare fields and relationships.

```ts
import { Model, Field, HasMany, BelongsTo } from 'vuex-rdb'

class User extends Model {
  @Field() id: number
  @Field() name: string
  @Field() email: string

  @HasMany(() => Post, 'userId')
  posts: Post[]

  static entityName = 'users'
}

class Post extends Model {
  @Field() id: number
  @Field() title: string
  @Field() userId: number

  @BelongsTo(() => User, 'userId')
  author: User

  static entityName = 'posts'
}
```

### Static Model Properties

| Property      | Type                              | Default  | Description                                                        |
| ------------- | --------------------------------- | -------- | ------------------------------------------------------------------ |
| `entityName`  | `string`                          | —        | Identifies the entity type (similar to a table name)               |
| `id`          | `string \| (item) => id`          | `'id'`   | Name of the ID field, or a function that resolves the ID           |

### Fields

Use `@Field()` for scalar values (strings, numbers, booleans, dates, etc.):

```ts
@Field() name: string
@Field() age: number
@Field() active: boolean
```

### Relationships

| Decorator                              | Description                                                  |
| -------------------------------------- | ------------------------------------------------------------ |
| `@Item(() => OtherModel)`              | Embeds a single related model (one-to-one)                   |
| `@List(() => OtherModel)`              | Embeds an array of related models (one-to-many)              |
| `@HasMany(() => OtherModel, fk)`       | Declares a one-to-many relationship via a foreign key        |
| `@BelongsTo(() => OtherModel, fk)`     | Declares the inverse of a `HasMany` relationship             |

```ts
class Post extends Model {
  @Field() id: number
  @Field() userId: number

  // Resolved by matching Post.userId to User.id
  @BelongsTo(() => User, 'userId')
  author: User
}

class User extends Model {
  @Field() id: number

  // All Posts where Post.userId === this.id
  @HasMany(() => Post, 'userId')
  posts: Post[]
}
```

> **Note:** The `@Item` and `@List` decorators are for embedding nested data in a single record, while `@HasMany` and `@BelongsTo` are for normalized relationships maintained across separate entity collections.

---

## Working with Data

### Adding data

```ts
// Add a single item — returns a Promise of the new entity's id
const id = await User.add({ name: 'Alice', email: 'alice@example.com' })

// Add multiple items — returns a Promise of an array of ids
const ids = await User.addAll([
  { name: 'Bob', email: 'bob@example.com' },
  { name: 'Carol', email: 'carol@example.com' },
])
```

### Finding data

```ts
// Find by id
const user = User.find(1)

// Find by id with related data loaded
const userWithPosts = User.find(1, { load: 'posts' })

// Load multiple or nested relationships
const userWithData = User.find(1, { load: ['posts', 'comments'] })
const userWithNested = User.find(1, { load: 'posts.comments' })

// Find multiple items by their ids
const users = User.findByIds([1, 2, 3])

// Get all items of this type
const allUsers = User.all()
const allUsersWithPosts = User.all({ load: 'posts' })
```

### Updating data

```ts
const user = User.find(1)

// Update specific fields — returns a Promise of the entity's id
await user.$update({ email: 'newemail@example.com' })

// You can also update related data
await user.$update({ posts: [{ id: 10, title: 'Updated title' }] })
```

### Creating instances with `new`

You can create a model instance without immediately saving it to the store. Assign properties normally, then call `$save()` when ready:

```ts
const user = new User()
user.name = 'Dave'
user.email = 'dave@example.com'

const id = await user.$save()

// Convert a model back to a plain object
const plain = user.$toObject()
```

---

## Querying

`Model.query()` returns a chainable `ModelQuery` builder. Call `.get()` to retrieve results or `.first()` for the first match.

```ts
const results = User.query()
  .where('name', '!=', 'Alice')
  .orderBy('name', 'asc')
  .get()

const firstActive = User.query()
  .where('active', true)
  .first()
```

You can also pass a function to `query()` to configure it inline:

```ts
const results = Post.query((q) => {
  q.where('published', true).orderBy('createdAt', 'desc')
}).get()
```

### Filtering

```ts
// Simple equality
query.where('status', 'active')

// With a comparison operator: =, !=, >, <, >=, <=, in
query.where('age', '>=', 18)
query.where('role', 'in', ['admin', 'editor'])

// Custom function
query.where((item) => item.score > 50 && item.active)

// OR conditions
query.where('status', 'active').orWhere('role', 'admin')
```

### Sorting

```ts
query.orderBy('createdAt', 'desc')
query.orderBy('name', 'asc')
```

### Eager loading relationships

```ts
// Load a single relationship
User.query().with('posts').get()

// Load multiple relationships
User.query().with(['posts', 'comments']).get()

// Load with nested relationships
User.query()
  .with('posts', (q) => q.with('comments'))
  .get()

// Load using a record of query functions
User.query()
  .with({ posts: (q) => q.where('published', true) })
  .get()

// Exclude all relationships from results
User.query().withoutRelationships().get()
```

---

## TypeScript Configuration

Decorators require the following options in your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true
  }
}
```

---

## License

[MIT](LICENCE.md)
