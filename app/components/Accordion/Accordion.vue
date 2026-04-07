<script setup lang="ts">
  import { computed, ref, watch } from "vue";

  export interface AccordionEntry {
    id?: string;
    title: string;
    amount: number | string | null;
    tierBg: string;
    tierIcon: string;
    copy: string;
    ctaText: string;
    icon: string;
    isOpenDefault?: boolean;
  }

  const props = defineProps<{
    items: AccordionEntry[];
    openId?: string | null;
  }>();

  const emit = defineEmits<{
    (e: "update:openId", value: string | null): void;
  }>();

  function toCamelCaseId(input: string): string {
    const words = input
      .trim()
      .toLowerCase()
      .replace(/['’]/g, "")
      .split(/[^a-z0-9]+/g)
      .filter(Boolean);

    return words
      .map((w, i) => (i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)))
      .join("");
  }

  const normalizedItems = computed(() =>
    props.items.map((item) => ({
      ...item,
      id: item.id ?? toCamelCaseId(item.title),
    }))
  );

  const defaultOpenId = computed(() => {
    const defaultItem = normalizedItems.value.find(
      (item) => item.isOpenDefault
    );
    return defaultItem?.id ?? null;
  });

  const activeId = ref<string | null>(
    typeof props.openId === "string" ? props.openId : defaultOpenId.value
  );

  watch(
    () => props.openId,
    (nextOpenId) => {
      if (typeof nextOpenId === "string" || nextOpenId === null) {
        activeId.value = nextOpenId;
      }
    }
  );

  const onToggle = (id: string) => {
    const nextOpenId = activeId.value === id ? null : id;
    activeId.value = nextOpenId;
    emit("update:openId", nextOpenId);
  };
</script>

<template>
  <div class="accordion flex column">
    <AccordionItem
      v-for="item in normalizedItems"
      :id="item.id"
      :key="item.id"
      :title="item.title"
      :amount="item.amount"
      :tier-bg="item.tierBg"
      :tier-icon="item.tierIcon"
      :copy="item.copy"
      :cta-text="item.ctaText"
      :icon="item.icon"
      :open-id="activeId"
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
