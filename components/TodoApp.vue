<template>
  <div>
    <todo-item
      v-for="todo in todos"
      :key="todo.id"
      :todo="todo"
    />
    <todo-creator @create-todo="createTodo"/>
  </div>
</template>

<script>
import lowdb from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage'
import cryptoRandomString from 'crypto-random-string'
import _cloneDeep from 'lodash/cloneDeep'
import TodoCreator from './TodoCreator'
import TodoItem from './TodoItem'

export default {
  components: {
    TodoCreator,
    TodoItem
  },
  data () {
    return {
      db: null,
      todos: []
    }
  },
  created () {
    this.initDB()
  },
  methods: {
    initDB () {
      const adapter = new LocalStorage('todo-app') // DB
      this.db = lowdb(adapter)

      console.log(this.db)

      const hasTodos = this.db.has('todos').value()
      if (hasTodos) {
        this.todos = _cloneDeep(this.db.getState().todos)
      } else {
        // Local DB 초기화
        this.db
          .defaults({
            todos: [] // Collection
          })
          .write()
      }
    },
    createTodo (title) {
      const newTodo = {
        id: cryptoRandomString({ length: 10 }),
        title,
        createdAt: new Date(),
        updateAt: new Date(),
        done: false
      }

      this.db
        .get('todos') // lodash
        .push(newTodo) // lodash
        .write() // lowdb
    }
  }
}
</script>
