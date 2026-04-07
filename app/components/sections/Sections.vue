<script setup lang="ts">
  import type { SectionItem } from "../../../schemaTypes/sections";
  import type { DefineComponent } from "vue";
  import { computed, watchEffect } from "vue";

  import SectionBanner from "./SectionBanner.vue";
  import SectionChampions from "./SectionChampions.vue";
  import SectionDonation from "./SectionDonation.vue";
  import SectionFooter from "./SectionFooter.vue";
  import SectionHero from "./SectionHero.vue";

  const props = defineProps<{
    sections: SectionItem[];
  }>();

  type SectionComponent = DefineComponent<{
    section: SectionItem;
  }>;

  // Dynamic component dispatch: we intentionally keep this map loosely typed so
  // template type-checking doesn't fail on the `section` prop for `<component :is="...">`.
  const componentByType: Record<string, SectionComponent | undefined> = {
    hero: SectionHero as SectionComponent,
    donation: SectionDonation as SectionComponent,
    champions: SectionChampions as SectionComponent,
    footer: SectionFooter as SectionComponent,
    banner: SectionBanner as SectionComponent,
  };

  // Warn only once per (id,type) pair.
  const warned = new Set<string>();
  watchEffect(() => {
    for (const section of props.sections) {
      const resolvedType = section.type ?? section.id;
      const component = componentByType[resolvedType];
      if (!component) {
        const key = `${section.id}:${resolvedType}`;
        if (!warned.has(key)) {
          console.warn(
            `[Sections] No component registered for section.type="${resolvedType}" (id="${section.id}")`,
          );
          warned.add(key);
        }
      }
    }
  });

  const resolvedSections = computed(() => {
    return props.sections
      .map((section) => {
        const resolvedType = section.type ?? section.id;
        const component = componentByType[resolvedType];
        if (!component) return null;
        return { section, component };
      })
      .filter(
        (item): item is { section: SectionItem; component: SectionComponent } =>
          item !== null,
      );
  });
</script>

<template>
  <div class="sections flex column gap-giga">
    <component
      :is="item.component"
      v-for="item in resolvedSections"
      :key="item.section.id"
      :section="item.section"
    />
  </div>
</template>
