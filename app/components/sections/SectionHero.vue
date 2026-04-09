<script setup lang="ts">
  import type { SectionItem } from "../../../schemaTypes/sections";
  import SectionHeroVideo from "@/components/SectionHeroVideo/SectionHeroVideo.vue";
  import { ref } from "vue";
  defineProps<{
    section: SectionItem;
  }>();

  const headerLogoVisible = ref(false);

  function onHeaderLogoVisible(visible: boolean) {
    headerLogoVisible.value = visible;
  }
</script>

<template>
  <div>
    <div
      class="section section-hero-container flex column gap-giga fixed top-0 left-0 w-full h-auto z-10"
    >
      <div class="section-hero relative">
        <SectionHeroVideo
          :video-src="section.props.videoSrc ?? ''"
          :video-poster="section.props.videoPoster"
          :title="section.props.title"
          :subhead="section.props.subhead"
          @header-logo-visible="onHeaderLogoVisible"
        />
      </div>
    </div>

    <div
      ref="headerLogoRef"
      class="flex absolute top-0 left-0 transition-opacity duration-300 ease-out z-0"
      :class="
        headerLogoVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      "
      style="
        width: 183px;
        height: 51px;
        margin-top: 85vh;
        left: 64px;
        top: 50px;
      "
    >
      <NuxtImg
        src="/_include/ui/header-logo.svg"
        alt="Acumen"
        width="183"
        height="51"
      />
    </div>

    <div
      class="flex column gap-lg container-md relative z-10"
      style="margin-top: calc(85vh + 100px)"
    >
      <RichText :richtext="section.props.richtext" />
    </div>
  </div>
</template>

<style scoped lang="scss">
  .section-hero-container {
    padding-top: 50px;
    padding-left: 64px;
    padding-right: 64px;
  }
</style>
