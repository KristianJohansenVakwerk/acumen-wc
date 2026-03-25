<script setup lang="ts">
import type { SectionItem } from "../../../schemaTypes/sections";

import TitleSection from "./TitleSection.vue";

defineProps<{
  section: SectionItem;
}>();
</script>

<template>
  <TitleSection :section="section" />
</template>

