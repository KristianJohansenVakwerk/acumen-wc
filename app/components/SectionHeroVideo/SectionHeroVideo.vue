<script setup lang="ts">
  import VideoLoop from "@/components/VideoLoop.vue";

  defineProps<{
    videoSrc: string;
  }>();
</script>

<template>
  <div class="section-hero-video">
    <VideoLoop
      v-if="videoSrc"
      :src="videoSrc"
      video-class="cover absolute top-0 left-0 w-full h-full section-hero-video__video section-hero-video__video__1 "
    />

    <VideoLoop
      v-if="videoSrc"
      :src="videoSrc"
      video-class="cover absolute top-0 right-0 w-full h-full section-hero-video__video section-hero-video__video__2"
    />
  </div>
</template>

<style scoped lang="scss">
  .section-hero-video {
    &__video {
      border-radius: 30px;

      &__1 {
        width: 80%;
        object-position: top left;
      }

      &__2 {
        width: 20%;
        object-position: top right;
      }
    }
  }
</style>
