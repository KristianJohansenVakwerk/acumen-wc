<script setup lang="ts">
  import ChampionCard from "./ChampionCard.vue";
  import type { ChampionItem } from "../../../schemaTypes/sections";

  defineProps<{
    items: ChampionItem[];
  }>();
</script>

<template>
  <div class="champions grid grid-2 gap-md">
    <ChampionCard
      v-for="item in items ?? []"
      :key="`${item.name}-${item.company ?? ''}-${item.country ?? ''}`"
      :item="item"
    />
  </div>
</template>
