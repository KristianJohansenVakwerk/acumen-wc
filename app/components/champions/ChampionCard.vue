<script setup lang="ts">
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
    class="champion-card grid-2 gap-md span-2 lg:span-1 color-white items-stretch"
    :class="item.bg ? `bg-${item.bg}` : ''"
  >
    <div
      class="champion-card__media span-2 giga:span-1"
      :class="item.imageBg ? `bg-${item.imageBg}` : ''"
      :style="{
        backgroundImage: `url(${frameUrl})`,
      }"
    >
      <img
        v-if="item.image"
        class="champion-card__image"
        :src="item.image"
        :alt="item.name"
        loading="lazy"
        decoding="async"
      />
    </div>

    <div class="champion-card__content flex column gap-sm span-2 giga:span-1">
      <p v-if="item.focusLabel" class="text text-caption text-bold color-blue">
        {{ item.focusLabel }}
      </p>

      <h3 class="text text-heading-sm text-display">
        {{ item.name }}
      </h3>
      <p
        v-if="item.role || item.company || item.country"
        class="text text-body-sm"
      >
        <span v-if="item.role">{{ item.role }}</span>
        <span v-if="item.company">{{ item.company }}</span>
        <span v-if="item.country">{{ item.country }}</span>
      </p>

      <p class="text text-body-md">
        {{ item.blurb }}
      </p>

      <p class="text text-body-sm text-bold">
        {{ item.ctaText }}
      </p>
    </div>
  </article>
</template>

<style scoped lang="scss">
  .champion-card {
    border-radius: 5px;
  }

  .champion-card__media {
    width: 100%;
    overflow: hidden;
    aspect-ratio: 351 / 469;
    padding: 20px 25px; /* indent/inset for the image */
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    border-radius: 5px;
  }

  .champion-card__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    /*
      Design file: 308x376 with top-right radius 110px.
      110 / 308 ≈ 35.7% → use % so it scales with the rendered image size.
      Keep other corners square as in the design.
    */
    border-radius: 0 30% 0 0;
  }
</style>
