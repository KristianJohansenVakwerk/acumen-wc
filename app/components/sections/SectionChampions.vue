<script setup lang="ts">
  import type { SectionItem } from "../../../schemaTypes/sections";

  defineProps<{
    section: SectionItem;
  }>();
</script>

<template>
  <div
    class="section section-champions flex column gap-giga px-giga relative z-10"
  >
    <div class="container-md flex column gap-lg">
      <h2
        class="text text-display-lg text-display color-blue text-align-center"
      >
        {{ section.props.title }}
      </h2>

      <RichText :richtext="section.props.richtext" />
    </div>

    <Champions :items="section.props.items ?? []" />
  </div>
</template>
