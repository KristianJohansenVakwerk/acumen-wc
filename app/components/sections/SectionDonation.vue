<script setup lang="ts">
  import type { SectionItem } from "../../../schemaTypes/sections";
  import type { AccordionEntry } from "../Accordion/Accordion.vue";
  import DonationIllustration from "../illustrations/DonationIllustration.vue";
  import { ref } from "vue";

  defineProps<{
    section: SectionItem;
  }>();

  const openId = ref<string | null>("matchMvp");
  function onIllustrationClick(option: { id: string }) {
    openId.value = option.id;
  }
</script>

<template>
  <div class="section-donation flex column gap-giga px-giga">
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
        <DonationIllustration @click="onIllustrationClick" />
      </div>
      <div class="span-6 lg:span-2">
        <Accordion
          v-model:open-id="openId"
          :items="section.props.tiers as AccordionEntry[]"
        />
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
