<script setup lang="ts">
  import type { SectionItem } from "../../../schemaTypes/sections";
  import SectionHeroVideo from "@/components/SectionHeroVideo/SectionHeroVideo.vue";
  import SectionHeroVideoTouch from "@/components/SectionHeroVideo/SectionHeroVideoTouch.vue";
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
        <div class="block sm:none relative z-20 px-md pt-md">
          <SectionHeroVideoTouch
            :video-src="section.props.videoSrc ?? ''"
            :video-poster="section.props.videoPoster as string"
            :title="section.props.title"
            :subhead="section.props.subhead"
            :scroll-end-el="headerLogoRef"
            @header-logo-visible="onHeaderLogoVisible"
          />
        </div>
        <div class="none sm:block relative z-20">
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
      class="flex column gap-lg container-md relative z-0 section-hero__richtext"
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
      margin-top: calc(75svh);

      @include sm-up {
        margin-top: 50vw;
      }
    }

    &__richtext {
      padding-top: 0px;

      @include md-up {
        padding-top: 100px;
      }

      @include lg-up {
        padding-top: 100px;
      }
    }

    &__logo {
      left: 100px;
      top: 25px;
      width: 200px;
      height: auto;

      @include lg-up {
        left: 64px;
        top: 50px;
        width: min(calc(183 / 1440 * 100%), 200px);
        height: auto;
      }
    }
  }
</style>
