export default {
  name: 'ranking',
  state () {
    return {
      category: '',
      romanceList: [],
      dramaList: []
    }
  },
  getters: {
    getCategory: state => state?.category || [],
    getRomanceList: state => state.romanceList,
    getDramaList: state => state.dramaList
  },
  mutations: {
    setCategory: (state, payload = '') => {
      state.category = payload;
    },
    setRomanceList: (state, payload = '') => {
      if(!payload || !Array.isArray(payload)) payload = [];
      state.romanceList = payload;
    },
    setDramaList: (state, payload = []) => {
      if(!payload || !Array.isArray(payload)) payload = [];
      state.dramaList = payload;
    }
  },
  actions: {
    getRomanceList ({commit}, payload = {page: 1}){
      
    }
  }
}