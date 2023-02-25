<template>
  <div class="ranking-wrap">
    <div class="ranking-title Headline">
      {{ categoryText }}
      장르 TOP {{ count }}
    </div>
    <div class="filter_wrap ">
      <div class="bg_b_300 ft_w_100">
        토글
      </div>
      <div class="bg_b_300 ft_w_100">무료회차 3회 이상</div>
      <div class="bg_b_300 ft_w_100">단행본</div>
    </div>
    <ul class="ranking-list">
      <li v-for="item in list" :key="item.id" class="ranking-item">
        <img class="ranking-img" :src="item.thumbnailSrc" />
        <div class="current-ranking SubTitle1" :class="item.changeStatus">{{ item.currentRank }}</div>
        <div class="ranking-content">
          <p class="title Body1 ft_t_100">
            <span class="type"></span>
            {{ item.title }}
          </p>
          <p class="artists Caption2 ft_t_400">{{ item.artists }}</p>
          <p class="freedCount Caption2 ft_t_400">{{ item.freedEpisodeSize }}화 무료</p>
          <span v-if="item.dayText" class="day Caption2 bd_r_900 ft_r_900">{{ item.dayText }}요일 연재</span>
          <span v-else class="day Caption2 bd_t_500 ft_t_500">연재종료</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'RankingPage',
  data () {
    return {
      category: '',
      list: [],
      count: 0
    }
  },
  computed: {
    categoryText () {
      if(this.category === 'romance'){
        return '로맨스'
      }
      return '드라마'
    }
  },
  watch: {
    '$route.query.genre': {
      immediate: true,
      handler () {
        this.category = this.$route?.query?.genre || 'romance';
      }
    }
  },
  async mounted () {
    const period = [{"MON": '월'}, {"TUE": '화'}, {"WED": '수'}, {"THU": '목'}, {"FRI": '금'}, {"SAT": '토'}, {"SUN": '일'}];
    const {hasNext, count, data} =  await this.$axios.$get('/comics/romance?page=1');
    this.list = data.map((item) => {
      // 작가명
      item.artists = item.artists.reduce((arr, cur) => {
        let name = cur?.name || '';
        if(arr) name = `, ${name}`;
        return arr + name;
      }, '');
      // 랭킹
      let changeStatus = '';
      if(item.currentRank > item.previousRank) {
        changeStatus = 'rising';
      } else if(item.currentRank > item.previousRank){
        changeStatus = 'falling';
      }
      // 연재 여부
      let dayText = '';
      if(item.contentsState === 'scheduled' && item?.schedule?.periods?.length){
        dayText = item.schedule.periods.map((unit) => Object.values(period.find((day) => Object.keys(day)[0] === unit))[0]).join(', ');
      }
      return {
        ...item,
        changeStatus,
        dayText
      };
    });
    this.count = count;
    console.log(this.list);
    console.log({hasNext, count, data});
  }
};
</script>

<style lang="scss" scoped>
.ranking-wrap{
  padding: 0 1rem 3rem;
  .ranking-title{
    margin-top: 2rem;
  }
  .ranking-list{
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 1rem;
    .ranking-item {
      display: flex;
      justify-content: flex-start;
      gap: 1rem;
      width: calc(calc(100% - 2rem) / 3);
      .ranking-img{
        width: 7rem;
        object-fit: contain;
        flex-shrink: 0;
      }
      .current-ranking{
        position: relative;
        min-width: .7rem;
        flex-shrink: 0;
        &.rising, &.falling{
          &:after{
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            display: inline-block;
            width: .7rem;
            height: .7rem;
            background: url('~/assets/images/arrow.png') no-repeat center;
            transform: translate(100%);
          }
          &.falling:after{
            transform: rotate(180deg) translate(-100%);
          }
        }
      }
      .current-ranking, .ranking-content{
        margin: .5rem 0;
      }
      .ranking-content{
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        .title{
          margin-bottom: 1rem;
        }
        .artists {
          margin-bottom: .3rem;
        }
        .day{
          display: flex;
          align-items: center;
          margin-top: auto;
          margin-left: auto;
          padding: .2rem .5rem;
          border-radius: 1rem;
          border: 1px solid;
        }
      }
    }
  }
  .filter_wrap{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin: 2rem 0;
    gap: 1rem;
    > * {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: .7rem 1rem;
      border-radius: 2rem;
    }
  }
}
</style>