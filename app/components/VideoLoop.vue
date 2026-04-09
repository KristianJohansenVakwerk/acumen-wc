<script setup lang="ts">
  defineProps<{
    src: string;
    videoClass?: string;
    poster?: string;
  }>();
</script>

<template>
  <video
    class="video"
    :class="videoClass"
    :src="src"
    :poster="poster"
    playsinline
    loop
    muted
    autoplay
  />
</template>

<style scoped lang="scss">
  .video {
    width: 100%;
    height: auto;
    display: block;
  }
</style>
