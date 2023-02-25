<template>
  <li class="comic-item">
    <img class="comic-img" :src="comicItem.thumbnailSrc" />
    <div class="comic-ranking SubTitle1">
      {{ comicItem.currentRank }}
      <span v-if="comicItem.currentRank !== comicItem.previousRank" class="ranking-change Caption2" :class="comicItem.currentRank > comicItem.previousRank ? 'falling ft_t_500' : 'rising ft_red'">
        {{ Math.abs(comicItem.currentRank - comicItem.previousRank) }}
      </span>
    </div>
    <div class="comic-content">
      <p class="title Body1 ft_t_100">
        <span class="type"></span>
        {{ comicItem.title }}
      </p>
      <p class="artists Caption2 ft_t_400">{{ artists }}</p>
      <p class="freedCount Caption2 ft_t_400">
        {{ comicItem.freedEpisodeSize }}화 무료
      </p>
      <span v-if="dayText" class="day Caption2 bd_r_900 ft_r_900"
        >{{ dayText }}요일</span
      >
      <span v-else class="day Caption2 bd_t_500 ft_t_500">완결</span>
    </div>
  </li>
</template>

<script>
  export default {
    props: {
      comicItem: {
        type: Object,
        default: () => {
          return {
            thumbnailSrc: String,
            contentsState: String,
            currentRank: Number,
            previousRank: Number,
            title: String,
            artists: Array,
            freedEpisodeSize: Number,
            schedule: Array
          }
        }
      }
    },
    computed: {
      artists () {
        // 작가명
        if(!this.comicItem?.artists.length) return '';
        return this.comicItem.artists.reduce((arr, cur) => {
            let name = cur?.name || '';
            if (arr) name = `, ${name}`;
            return arr + name;
          }, '');
      },
      dayText () {
        if(this.comicItem?.contentsState !== 'scheduled' || !this.comicItem?.schedule?.periods?.length) return false;
        const periodList = [
          { MON: '월' },
          { TUE: '화' },
          { WED: '수' },
          { THU: '목' },
          { FRI: '금' },
          { SAT: '토' },
          { SUN: '일' },
        ];
        const schedule = this.comicItem.schedule.periods;
        return Object.values(periodList.find((period) => Object.keys(period)[0] === schedule[0]))[0];
      }
    }
  };
</script>

<style lang="scss" scoped>
.comic-item {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 1rem;
  width: calc(calc(100% - 2rem) / 3);
  .comic-img{
    width: 7rem;
    object-fit: contain;
    flex-shrink: 0;
  }
  .comic-ranking{
    position: relative;
    min-width: .7rem;
    flex-shrink: 0;
    .ranking-change{
      position: absolute;
      display: inline-flex;
      align-items: center;
      left: 50%;
      bottom: 0;
      transform: translate(-50%, 100%);
      white-space: nowrap;
      &::before{
        content: '';
        display: inline-block;
        margin-right: .1rem;
      }
      &.falling::before{
        border-top: 4px solid;
        border-left: 3px solid transparent;
        border-right: 3px solid transparent;
        @extend .bd_t_500;
      }
      &.rising::before{
        border-bottom: 4px solid;
        border-left: 3px solid transparent;
        border-right: 3px solid transparent;
        @extend .bd_red;
      }
    }
  }
  .comic-ranking, .comic-content{
    padding: .5rem 0;
  }
  .comic-content{
    width: 100%;
    height: 100%;
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
</style>
