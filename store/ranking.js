export default {
  name: 'ranking',
  state() {
    return {
      category: '',
      romanceList: [],
      dramaList: [],
    };
  },
  getters: {
    getCategory: (state) => state?.category || [],
    getRomanceList: (state) => state.romanceList,
    getDramaList: (state) => state.dramaList,
  },
  mutations: {
    setCategory: (state, payload = '') => {
      state.category = payload;
    },
    setRomanceList: (state, payload = '') => {
      if (!payload || !Array.isArray(payload)) payload = [];
      state.romanceList = payload;
    },
    setDramaList: (state, payload = []) => {
      if (!payload || !Array.isArray(payload)) payload = [];
      state.dramaList = payload;
    },
  },
  actions: {
    async getComicList(
      { getters, commit },
      payload = { genre: 'romance', page: 1 }
    ) {
      try {
        let { genre, page } = payload;
        if (!genre) genre = 'romance';
        const isFirst = page === 1;
        if (!page) page = 1;
        const { hasNext, count, data } = await this.$axios.$get(
          `/comics/${genre}`,
          { params: { page } }
        );
        const genreUpper = genre.replace(/^[a-z]/, (char) =>
          char.toUpperCase()
        );
        const prevList = isFirst ? [] : getters[`get${genreUpper}List`];
        commit(`set${genreUpper}List`, [...prevList, ...data]);
        return {
          hasNext,
          count,
          data,
        };
      } catch (e) {
        console.error(e);
      }
    },
  },
};
