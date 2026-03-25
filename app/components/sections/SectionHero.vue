<script setup lang="ts">
  import type { SectionItem } from "../../../schemaTypes/sections";
  import VideoLoop from "../VideoLoop.vue";

  defineProps<{
    section: SectionItem;
  }>();
</script>

<template>
  <div class="section-hero-container flex column gap-lg">
    <div class="section-hero relative">
      <VideoLoop
        v-if="section.props.videoSrc"
        :src="section.props.videoSrc"
        video-class="cover absolute top-0 left-0 w-full h-full"
      />
      <div class="section-hero__overlay">
        <img
          class="section-hero__icon mb-lg"
          src="/_include/icons/hero_icon.svg"
          :alt="section.props.title"
        />
        <h1 class="text text-heading-xl text-black color-white">
          {{ section.props.subhead }}
        </h1>
      </div>
    </div>
    <div class="flex column gap-md container-md">
      <RichText :richtext="section.props.richtext" />
    </div>
  </div>
</template>

<style scoped lang="scss">
  .section-hero {
    aspect-ratio: 1310/600;
    overflow: hidden;
  }

  .section-hero__overlay {
    position: absolute;
    left: 50px;
    bottom: 40px;
    z-index: 1;
  }

  .section-hero__icon {
    display: block;
    width: 245px;
    height: auto;
  }
</style>
