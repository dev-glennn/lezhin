<template>
  <div id="header" class="ft_w_100">
    <div class="header-icon" @click="routerChange('romance')" />
    <nav>
      <ul class="menu_list">
        <li v-for="nav in navList" :key="nav.id">
          <nuxt-link :to="routerChange(nav.id, 'return')" class="ft_w_100 Body1">{{ nav.text }}</nuxt-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        category: '',
        navList: [
          { id: 'romance', text: '로맨스' },
          { id: 'drama', text: '드라마' },
        ],
      };
    },
    watch: {
      '$route.query.genre': {
        immediate: true,
        handler () {
          this.category = this.$route?.query?.genre || 'romance';
        }
      }
    },
    created() {
      if(!this.category){
        this.routerChange('romance', 'replace');
      }
    },
    methods: {
      routerChange (category = '', type = 'push') {
        const url = `/ranking?genre=${category}`;
        if(type === 'return'){
          return url;
        }
        this.$router[type](url);
      }
    }
  };
</script>

<style lang="scss" scoped>
  #header {
    display: grid;
    grid: 5rem / 4rem auto;
    align-items: center;
    width: 100%;
    padding: 0 1rem;
    gap: 1rem;
    .header-icon {
      width: 2.5rem;
      height: 2.5rem;
      background: #ed1c24
        url('https://ccdn.lezhin.com/files/assets/img/jaymee.svg') no-repeat 50%;
      background-size: 60%;
      cursor: pointer;
    }
    .menu_list {
      display: flex;
      justify-content: flex-start;
      gap: 2rem;
      a {
        padding: 1rem;
      }
    }
  }
</style>
