<script setup lang="ts">
  import type { SectionItem } from "../../../schemaTypes/sections";
  import SectionHeroVideo from "@/components/SectionHeroVideo/SectionHeroVideo.vue";
  import { ref } from "vue";
  defineProps<{
    section: SectionItem;
  }>();

  const headerLogoVisible = ref(false);
  const sectionHeroVideoRef = ref<HTMLElement | null>(null);
  const headerLogoRef = ref<HTMLElement | null>(null);
  function onHeaderLogoVisible(visible: boolean) {
    headerLogoVisible.value = visible;
  }
</script>

<template>
  <div>
    <div
      class="section section-hero flex column gap-giga fixed top-0 left-0 w-full h-auto z-99"
    >
      <div ref="sectionHeroVideoRef" class="section-hero__videos relative z-20">
        <div class="relative pt-md md:pt-none z-20">
          <SectionHeroVideo
            :video-src="section.props.videoSrc ?? ''"
            :video-poster="section.props.videoPoster as string"
            :title="section.props.title"
            :subhead="section.props.subhead"
            :scroll-end-el="headerLogoRef"
            @header-logo-visible="onHeaderLogoVisible"
          />
        </div>
      </div>
    </div>

    <div
      ref="headerLogoRef"
      class="flex absolute top-0 left-0 transition-opacity duration-300 ease-out z-0 section-hero__logo"
      :class="
        headerLogoVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
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
      class="flex column px-md md:px-giga lg:px-none gap-lg container-md relative z-0 section-hero__richtext"
    >
      <RichText :richtext="section.props.richtext" />
    </div>
  </div>
</template>

<style scoped lang="scss">
  .section-hero {
    padding-top: 0px;
    pointer-events: none;

    @include md-up {
      padding-top: 25px;
    }
    @include lg-up {
      padding-top: 50px;
    }

    &__logo,
    &__richtext {
      margin-top: calc(454px);

      @include md-up {
        margin-top: 50vw;
      }
    }

    &__richtext {
      padding-top: 100px;
    }

    &__logo {
      left: 50%;
      top: 0px;
      width: 200px;
      height: auto;
      transform: translateX(-50%);

      @include lg-up {
        left: 64px;
        top: 50px;
        transform: translateX(0);
        width: min(calc(183 / 1440 * 100%), 200px);
        height: auto;
      }
    }
  }
</style>
