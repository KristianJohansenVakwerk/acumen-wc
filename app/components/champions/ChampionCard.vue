<script setup lang="ts">
  import { computed } from "vue";
  import type { ChampionItem } from "../../../schemaTypes/sections";

  const props = defineProps<{
    item: ChampionItem;
  }>();

  const frameByBg: Record<string, string> = {
    red: "/_include/ui/champion-frame.svg",
    "purple-dark": "/_include/ui/champion-frame-purple.svg",
    "green-dark": "/_include/ui/champion-frame-green.svg",
    green: "/_include/ui/champion-frame-green.svg",
    blue: "/_include/ui/champion-frame-blue.svg",
  };

  const frameUrl = computed(() => frameByBg[props.item.bg] ?? frameByBg.red);
</script>

<template>
  <article
    class="champion-card grid-2 gap-md color-white items-stretch"
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
    </div>

    <div
      class="champion-card__content flex column justify-space-between gap-md span-2 lg:span-1"
    >
      <!-- <p v-if="item.focusLabel" class="text text-caption text-bold color-blue">
        {{ item.focusLabel }}
      </p> -->
      <div class="flex column gap-md">
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
        class="text text-body-md text-bold text-underline"
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
  .champion-card {
    border-radius: 5px;

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

      // .champion-card__meta {
      //   display: inline-flex;
      //   align-items: center;
      //   gap: 10px;
      // }

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
    }
  }
</style>
