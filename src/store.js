import { createStore } from 'vuex';  

const store = createStore({  
  state: {  
    DBID: '670e3bfb7f4b0b1583fc4697'    //670e3bfb7f4b0b1583fc4697 670e3bfa7f4b0b1583fc411b
  },  
  mutations: {  
    setDBID(state, newDBID) {  
      state.DBID = newDBID;  
    }  
  },  
  actions: {  
    updateDBID({ commit }, newDBID) {  
      commit('setDBID', newDBID);  
    }  
  },
  getters: {
    getDBID(state) {
        return state.DBID
    }
  }
});  

export default store;