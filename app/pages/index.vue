<script setup lang="ts">
  import { sectionsDocSchema } from "../../schemaTypes/sections";
  import Sections from "../components/sections/Sections.vue";

  type QueryCollectionBuilder = {
    first: () => Promise<unknown>;
  };
  declare const queryCollection: (collection: string) => QueryCollectionBuilder;

  const { data: page } = await useAsyncData(() => {
    return queryCollection("sections").first();
  });

  if (!page.value) {
    throw createError({
      statusCode: 404,
      statusMessage: "Sections content not found",
    });
  }

  const validatedPage = sectionsDocSchema.parse(page.value as unknown);
  const sections = validatedPage.sections;
</script>

<template>
  <div>
    <main class="page-home min-h-screen md:pt-lg pb-lg md:pb-giga">
      <Sections :sections="sections" />
    </main>
  </div>
</template>

<style scoped lang="scss">
  /* Intentionally minimal */
</style>
