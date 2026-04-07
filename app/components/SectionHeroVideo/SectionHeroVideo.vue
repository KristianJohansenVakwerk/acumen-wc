<script setup lang="ts">
  import VideoLoop from "@/components/VideoLoop.vue";

  defineProps<{
    videoSrc: string;
  }>();
</script>

<template>
  <div>
    <div class="section-hero-video">
      <div
        class="section-hero-video__video-container section-hero-video__video-container__1"
      >
        <VideoLoop
          v-if="videoSrc"
          :src="videoSrc"
          video-class="cover w-full h-full section-hero-video__video section-hero-video__video__1 "
        />
      </div>

      <!-- <VideoLoop
        v-if="videoSrc"
        :src="videoSrc"
        video-class="cover absolute top-0 right-0 w-full h-full section-hero-video__video section-hero-video__video__2"
      /> -->
    </div>
  </div>
</template>

<style scoped lang="scss">
  .section-hero-video {
    &__video-container {
      width: 100%;
      height: auto;
      position: relative;
      aspect-ratio: 1310/600;

      // border-radius: 30px;
      overflow: hidden;
      // clip-path: inset(0 round 30px);
      width: 100%;

      -webkit-mask-image: linear-gradient(
        to right,
        rgba(0, 0, 0, 1) 80%,
        rgba(0, 0, 0, 0) 80%
      );
      mask-image: linear-gradient(
        to right,
        rgba(0, 0, 0, 1) 80%,
        rgba(0, 0, 0, 0) 80%
      );
      -webkit-mask-repeat: no-repeat;
      mask-repeat: no-repeat;
      -webkit-mask-size: 100% 100%;
      mask-size: 100% 100%;
      height: 100%;
      // border-radius: 30px;

      &__1 {
      }

      &__1 {
      }
    }
    &__video {
      &__1 {
        // width: 100%;
        // height: 100%;
        // object-fit: cover;
        // object-position: top left;

        // -webkit-mask-image: linear-gradient(
        //   to right,
        //   rgba(0, 0, 0, 1) 80%,
        //   rgba(0, 0, 0, 0) 100%
        // );
        // mask-image: linear-gradient(
        //   to right,
        //   rgba(0, 0, 0, 1) 80%,
        //   rgba(0, 0, 0, 0) 100%
        // );
        // -webkit-mask-repeat: no-repeat;
        // mask-repeat: no-repeat;
        // -webkit-mask-size: 100% 100%;
        // mask-size: 100% 100%;
      }

      &__2 {
        width: 100%;
        object-position: top right;
        -webkit-mask-image: linear-gradient(
          to left,
          rgba(0, 0, 0, 1) 20%,
          rgba(0, 0, 0, 0) 20%
        );
        mask-image: linear-gradient(
          to left,
          rgba(0, 0, 0, 1) 20%,
          rgba(0, 0, 0, 0) 20%
        );
        -webkit-mask-repeat: no-repeat;
        mask-repeat: no-repeat;
        -webkit-mask-size: 100% 100%;
        mask-size: 100% 100%;
        height: 100%;
        border-radius: 30px;
      }
    }
  }
</style>
