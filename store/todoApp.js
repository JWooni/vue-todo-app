export default {
  namespaced: true,
  state: () => ({
      db: null,
      todos: []    
  }),
  getters: {},
  mutations: {},
  actions: {
    initDB({ state }) {
      const adapter = new LocalStorage('todo-app') // DB name
      state.db = low(adapter)
      const hasTodos = state.db
        .has('todos') // Collection name
        .value()
      // 기존에 저장된 DB가 있는지 확인
      if (hasTodos) {
        // 깊은 배열 복사, `state.todos`를 수정할 때 `state.db.getState().todos`를 직접 참조하는 문제를 방지할 수 있습니다.
        state.todos = _cloneDeep(state.db.getState().todos)
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