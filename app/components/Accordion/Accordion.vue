<script setup lang="ts">
  import { computed, ref, watch } from "vue";

  export interface AccordionEntry {
    title: string;
    amount: number | string | null;
    text: string;
    copy: string;
    ctaText: string;
    icon: string;
    isOpenDefault?: boolean;
  }

  const props = defineProps<{
    items: AccordionEntry[];
    openIndex?: number;
  }>();

  const emit = defineEmits<{
    (e: "update:openIndex", value: number): void;
  }>();

  const defaultOpenIndex = computed(() =>
    props.items.findIndex((item) => item.isOpenDefault),
  );
  const activeIndex = ref(
    typeof props.openIndex === "number"
      ? props.openIndex
      : defaultOpenIndex.value,
  );

  watch(
    () => props.openIndex,
    (nextOpenIndex) => {
      if (typeof nextOpenIndex === "number") {
        activeIndex.value = nextOpenIndex;
      }
    },
  );

  const onToggle = (index: number) => {
    const nextOpenIndex = activeIndex.value === index ? -1 : index;
    activeIndex.value = nextOpenIndex;
    emit("update:openIndex", nextOpenIndex);
  };
</script>

<template>
  <div class="accordion flex column">
    <AccordionItem
      v-for="(item, index) in items"
      :key="`${item.title}-${index}`"
      :title="item.title"
      :amount="item.amount"
      :text="item.text"
      :copy="item.copy"
      :cta-text="item.ctaText"
      :icon="item.icon"
      :index="index"
      :open-index="activeIndex"
      @toggle="onToggle"
    />
  </div>
</template>

<style scoped lang="scss">
  .accordion {
    gap: 0;
    width: 100%;
  }
</style>
