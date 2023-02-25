<template>
  <div class="error-wrap">
    <p class="error-title Headline ft_t_100">페이지를 찾을 수 없어요!</p>
    <img
      class="error-img"
      :src="'https://ccdn.lezhin.com/files/assets/img/jaymee-404.png'"
    />
    <button class="error-button bg_red ft_w_100 Body2" @click="goRomance">
      로맨스 랭킹으로
    </button>
  </div>
</template>

<script>
  export default {
    methods: {
      goRomance() {
        this.$router.replace(`/ranking`);
      },
    },
  };
</script>

<style lang="scss">
  .error-wrap {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 5rem;
    .error-button {
      padding: 0.6rem 1.3rem;
      border-radius: 0.1rem;
    }
  }
</style>
