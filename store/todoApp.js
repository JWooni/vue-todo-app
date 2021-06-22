export default {
  namespaced: true,
  state: () => ({
      db: null,
      todos: []    
  }),
  getters: {
    total (state) {
      return state.todos.length
    },
    activeCount (state) {
      return state.todos.filter(todo => !todo.done).length
    },
    completedCount (state, getters) {
      return getters.total - getters.activeCount
    }
  },
  mutations: {
    assignDB(state, db) {
      state.db = db
    },
    assignTodos(state, todos) {
      state.todos = todos
    }
  },
  actions: {
    initDB({ state, commit }) {
      const adapter = new LocalStorage('todo-app') // DB name
      // state.db = low(adapter)
      commit('assignDB', low(adapter))

      const hasTodos = state.db
        .has('todos') // Collection name
        .value()
      // 기존에 저장된 DB가 있는지 확인
      if (hasTodos) {
        // 깊은 배열 복사, `state.todos`를 수정할 때 `state.db.getState().todos`를 직접 참조하는 문제를 방지할 수 있습니다.
        //state.todos = _cloneDeep(state.db.getState().todos)
        commit('assignTodos', state.todos = _cloneDeep(state.db.getState().todos))
      } else {
        // Local DB 초기화
        state.db
          .defaults({
            todos: []
          })
          .write()
      }
    },
  }
}