<template>
  <img class="icon-style" :class="[this.sizeClass, {click: click}]" :src="src" :style="{backgroundImage: `url(${src})`}" @click="clickAction" />
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'small'
    }
  },
  computed: {
    sizeClass () {
      const sizeArray = ['large', 'medium', 'small', 'tiny', 'size_18'];
      return sizeArray.includes(this.size) ? this.size : 'small';
    }
  },
  methods: {
    clickAction (e) {
      this.$emit('click', e);
    }
  }
};
</script>
