<script setup lang="ts">
  import type { SectionItem } from "../../../schemaTypes/sections";

  defineProps<{
    section: SectionItem;
  }>();
</script>

<template>
  <div class="section-champions flex column gap-md">
    <h2
      class="text text-display-lg text-display color-blue container-md text-align-center"
    >
      {{ section.props.title }}
    </h2>

    <div class="container-md">
      <RichText :richtext="section.props.richtext" />
    </div>

    <Champions :items="section.props.items" />
  </div>
</template>
