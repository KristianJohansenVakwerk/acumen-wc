<script setup lang="ts">
  import type { SectionItem } from "../../../schemaTypes/sections";

  defineProps<{
    section: SectionItem;
  }>();
</script>

<template>
  <h2
    class="text text-display-lg text-display container-md text-align-center color-blue"
  >
    {{ section.props.title }}
  </h2>
</template>

<style scoped lang="scss">
  .onepager__section {
    margin-bottom: $md;
  }
</style>
