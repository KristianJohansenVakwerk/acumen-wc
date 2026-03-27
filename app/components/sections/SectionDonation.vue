<script setup lang="ts">
  import type { SectionItem } from "../../../schemaTypes/sections";
  import DonationIllustration from "../illustrations/DonationIllustration.vue";

  defineProps<{
    section: SectionItem;
  }>();
</script>

<template>
  <div class="section-donation flex column gap-giga">
    <div class="container-md flex column gap-lg">
      <h2
        class="text text-display-lg text-display color-blue container-md text-align-center"
      >
        {{ section.props.title }}
      </h2>

      <RichText :richtext="section.props.richtext" />
    </div>

    <div class="section-donation__illustration grid-6 gap-giga container">
      <div class="span-6 lg:span-4">
        <DonationIllustration />
      </div>
      <div class="span-6 lg:span-2 debug">
        <Accordion :items="section.props.tiers" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .section-donation {
    &__illustration {
      width: 100%;
      height: auto;
    }
  }
</style>
