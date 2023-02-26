<template>
  <div class="ranking-wrap">
    <div class="ranking-title Headline">
      {{ genreText }}
      장르 TOP {{ count }}
    </div>
    <div class="filter_wrap bg_b_100">
      <div
        v-for="_filter in filter"
        :key="_filter.id"
        :class="{ active: _filter.active }"
        @click="filterClick(_filter.id)"
      >
        {{ _filter.text }}
      </div>
    </div>
    <div class="ranking-list">
      <ComicItem
        v-for="item in filterList"
        :key="item.id"
        class="ranking-item"
        :comicItem="item"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
export default {
  name: 'RankingPage',
  data() {
    return {
      // option
      genre: '',
      count: 0,
      hasNext: false,
      page: 1,
      // filter
      filter: [
        { id: 'all', active: false, text: '전체' },
        { id: 'scheduled', active: false, text: '연재' },
        { id: 'completed', active: false, text: '완료' },
        { id: 'freedEpisodeSize', active: false, text: '무료회차 3회 이상' },
        { id: 'isPrint', active: false, text: '단행본' },
      ],
      // observe
      observer: null,
      observerItem: null,
    };
  },
  computed: {
    ...mapGetters({
      romanceList: 'ranking/getRomanceList',
      dramaList: 'ranking/getDramaList',
    }),
    genreText() {
      if (this.genre === 'romance') {
        return '로맨스';
      }
      return '드라마';
    },
    list() {
      return JSON.parse(JSON.stringify(this[`${this.genre}List`]));
    },
    filterList() {
      return this.list.filter((item) => {
        const scheduled = this.filter[this.getFilterItem('scheduled')].active;
        const completed = this.filter[this.getFilterItem('completed')].active;
        const freedEpisodeSize =
          this.filter[this.getFilterItem('freedEpisodeSize')].active;
        const isPrint = this.filter[this.getFilterItem('isPrint')].active;
        let result = true;
        if (scheduled) {
          result = item.contentsState === 'scheduled';
        }
        if (result && completed) {
          result = item.contentsState === 'completed';
        }
        if (result && freedEpisodeSize) {
          result = item.freedEpisodeSize >= 3;
        }
        if (result && isPrint) {
          result = item.isPrint;
        }
        return result;
      });
    },
  },
  watch: {
    '$route.query.genre': {
      immediate: true,
      handler() {
        this.genre = this.$route?.query?.genre || 'romance';
      },
    },
    genre: {
      handler(n) {
        if (n) {
          this.initData();
        }
      },
    },
    filter: {
      handler() {
        if (this.observer && this.observerItem) {
          this.observer.unobserve(this.observerItem);
        }
        this.$nextTick(() => {
          this.observeScroll();
        });
      },
      deep: true,
    },
  },
  created() {},
  async mounted() {
    this.initData();
  },
  methods: {
    ...mapActions({
      getComicList: 'ranking/getComicList',
    }),
    getFilterItem(id = '') {
      return this.filter.findIndex((item) => item.id === id);
    },
    filterClick(id = '') {
      if (id === 'all') {
        this.filter.forEach((item) => {
          item.active = false;
        });
      } else {
        this.filter[0].active = false;
        let other = -1;
        if (id === 'scheduled') {
          other = this.getFilterItem('completed');
        } else if (id === 'completed') {
          other = this.getFilterItem('scheduled');
        }
        if (other !== -1) {
          this.filter[other].active = false;
        }
      }
      const findIndex = this.getFilterItem(id);
      this.filter[findIndex].active = !this.filter[findIndex].active;
      if (!this.filter.find((item) => item.active)) {
        this.filterClick('all');
      }
    },
    async initData() {
      if (this.observer && this.observerItem) {
        this.observer.unobserve(this.observerItem);
      }
      this.page = 1;
      await this.getComicListHandler();
      this.filterClick('all');
      this.$nextTick(() => {
        this.observeScroll();
      });
    },
    async getComicListHandler() {
      const { count, hasNext } = await this.getComicList({
        genre: this.genre,
        page: this.page,
      });
      this.count = count;
      this.hasNext = hasNext;
    },
    observeScroll() {
      // get observe last item
      const getLastItem = (prevItem) => {
        const items = document.querySelector('.ranking-list').children;
        const lastItem =
          items[items.length > 5 ? items.length - 5 : items.length - 1];
        if (prevItem === lastItem) {
          return;
        }
        this.observer.observe(lastItem);
        this.observerItem = lastItem;
      };
      // handler observe
      const observerHandler = (entries) => {
        entries.forEach(async (entry) => {
          if (entry.isIntersecting) {
            this.observer.unobserve(entry.target);
            // 더 이상 불러올 데이터가 없는 경우
            if (!this.hasNext) {
              return;
            }
            this.page++;
            await this.getComicListHandler();
            getLastItem(entry.target);
          }
        });
      };
      // observe option
      this.observer = new IntersectionObserver(observerHandler, {
        threshold: 0.7,
      });
      getLastItem(this.observer);
    },
  },
};
</script>

<style lang="scss" scoped>
.ranking-wrap {
  padding: 0 1rem 3rem;
  .ranking-title {
    margin-top: 2rem;
  }
  .ranking-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 1rem;
  }
  .filter_wrap {
    position: sticky;
    top: 0;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin: 1rem 0;
    padding: 1rem 0;
    gap: 1rem;
    z-index: 1;
    > * {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0.7rem 1rem;
      border-radius: 2rem;
      cursor: pointer;
      &.active {
        @extend .bg_red, .ft_w_100;
      }
      &:not(.active) {
        @extend .bg_b_300, .ft_w_100;
      }
    }
  }
}
</style>
