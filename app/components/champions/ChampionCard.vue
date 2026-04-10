<script setup lang="ts">
  import { computed, ref } from "vue";
  import type { ChampionItem } from "../../../schemaTypes/sections";

  const props = defineProps<{
    item: ChampionItem;
  }>();

  const cardEl = ref<HTMLElement | null>(null);
  const contentEl = ref<HTMLElement | null>(null);

  const frameByBg: Record<string, string> = {
    red: "/_include/ui/champion-frame.svg",
    "purple-dark": "/_include/ui/champion-frame-purple.svg",
    "green-dark": "/_include/ui/champion-frame-green.svg",
    green: "/_include/ui/champion-frame-green.svg",
    blue: "/_include/ui/champion-frame-blue.svg",
  };

  const frameUrl = computed(() => frameByBg[props.item.bg] ?? frameByBg.red);

  function swipeToLearnMore() {
    if (!cardEl.value || !contentEl.value) return;
    cardEl.value.scrollTo({
      left: contentEl.value.offsetLeft,
      behavior: "smooth",
    });
  }
</script>

<template>
  <article
    ref="cardEl"
    class="champion-card span-2 md:span-1 lg:span-1 grid-2 gap-md color-white items-stretch"
    :class="item.bg ? `bg-${item.bg}` : ''"
  >
    <div
      class="champion-card__media span-2 lg:span-1"
      :class="item.imageBg ? `bg-${item.imageBg}` : ''"
      :style="{
        backgroundImage: `url(${frameUrl})`,
      }"
    >
      <figure>
        <img
          v-if="item.image"
          class="champion-card__media__image"
          :src="item.image"
          :alt="item.name"
          loading="lazy"
          decoding="async"
        />
        <figcaption
          v-if="item.image"
          class="flex row items-center gap-md"
          :class="item.bg ? `bg-${item.bg}` : ''"
        >
          <img
            v-if="item.flag"
            :src="item.flag"
            :alt="`${item.country ?? 'Country'} flag`"
            loading="lazy"
            decoding="async"
          />
          <span class="champion-card__meta__label text text-body text-black">
            {{ item.company }}
          </span>
        </figcaption>
      </figure>

      <div
        class="champion-card__swipe-cta-container flex lg:none row items-center justify-space-between mt"
        @click="swipeToLearnMore"
      >
        <div
          class="champion-card__swipe-cta text text-body text-black text-white"
        >
          Swipe to learn more
        </div>
        <div>
          <svg
            width="46"
            height="46"
            viewBox="0 0 46 46"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="23" cy="23" r="22" stroke="white" stroke-width="2" />
            <path
              d="M33.7071 23.7071C34.0976 23.3166 34.0976 22.6834 33.7071 22.2929L27.3431 15.9289C26.9526 15.5384 26.3195 15.5384 25.9289 15.9289C25.5384 16.3195 25.5384 16.9526 25.9289 17.3431L31.5858 23L25.9289 28.6569C25.5384 29.0474 25.5384 29.6805 25.9289 30.0711C26.3195 30.4616 26.9526 30.4616 27.3431 30.0711L33.7071 23.7071ZM12 23V24L33 24V23V22L12 22V23Z"
              fill="white"
            />
          </svg>
        </div>
      </div>
    </div>

    <div
      ref="contentEl"
      class="champion-card__content flex column justify-space-between gap-md span-2 lg:span-1 pl-md md:pl-none"
    >
      <div class="flex column gap-md pl-md">
        <h3 class="text text-heading-sm text-display">
          {{ item.name }}
        </h3>
        <p
          v-if="item.role || item.company || item.country"
          class="text text-body-sm text-bold"
        >
          <span v-if="item.role">{{ item.role }}</span>
          <span v-if="item.company">{{ item.company }}</span>
          <span v-if="item.country">{{ item.country }}</span>
        </p>

        <p class="text text-body-sm">
          {{ item.blurb }}
        </p>
      </div>

      <a
        class="text text-body text-bold text-underline pl-md md:pl-none"
        :href="item.ctaLink"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ item.ctaText }}
      </a>
    </div>
  </article>
</template>

<style scoped lang="scss">
  @use "@/assets/scss/base/_mediaQueries" as *;

  .champion-card {
    border-radius: 5px;

    // Mobile-only: swipe left to reveal content
    @include lg-down {
      display: flex;
      flex-wrap: nowrap;
      width: 100%;
      overflow-x: auto;
      overflow-y: hidden;
      scroll-snap-type: x mandatory;
      -webkit-overflow-scrolling: touch;
      overscroll-behavior-x: none;

      // Hide scrollbar (still swipeable)
      scrollbar-width: none; // Firefox
      &::-webkit-scrollbar {
        display: none; // WebKit
      }
    }

    &__media {
      width: 100%;
      height: auto;
      overflow: hidden;
      // aspect-ratio: 351 / 469;
      padding: 20px 25px; /* indent/inset for the image */
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
      border-radius: 5px;

      @include lg-down {
        flex: 0 0 100%;
        scroll-snap-align: start;
        scroll-snap-stop: always;
      }

      figure {
        height: auto;
        width: 100%;
      }
      figcaption {
        img {
          height: 53px;
          width: auto;
        }
      }

      &__image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        aspect-ratio: 308 / 378;
        border-radius: 0 30% 0 0;
      }
    }

    &__content {
      padding: 20px 25px 20px 0px;

      @include lg-down {
        flex: 0 0 100%;
        scroll-snap-align: start;
        scroll-snap-stop: always;

        padding: 30px 25px;

        // Remove utility paddings used for desktop grid spacing
        > div,
        > a {
          padding-left: 0;
        }
      }
    }
  }
</style>
