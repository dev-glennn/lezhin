<template>
  <div class="layout ft_w_100">
    <Header />
    <Nuxt/>
  </div>
</template>

<script>
export default {
  

}
</script>

<style lang="scss" scoped>
.layout{
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
  > *{
    width: 100%;
    max-width: 1000px;
  }
}
</style>