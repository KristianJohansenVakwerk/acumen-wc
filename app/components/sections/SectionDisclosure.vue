<script setup lang="ts">
  import type { SectionItem } from "../../../schemaTypes/sections";

  defineProps<{
    section: SectionItem;
  }>();
</script>

<template>
  <div
    class="section section-disclosure flex column gap-md px-md md:px-giga lg:px-giga relative z-10"
  >
    <div class="container-md flex column gap">
      <RichText
        :richtext="section.props.richtext"
        p-class="text text-label color-black "
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
  .section-disclosure {
    opacity: 0.85;
  }
</style>
