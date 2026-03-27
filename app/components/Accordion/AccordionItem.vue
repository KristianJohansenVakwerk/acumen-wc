<script setup lang="ts">
  import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";

  const props = defineProps<{
    title: string;
    amount: number | string | null;
    text: string;
    copy: string;
    ctaText: string;
    icon: string;
    index: number;
    openIndex: number;
  }>();

  const emit = defineEmits<{
    (e: "toggle", value: number): void;
  }>();

  const isOpen = computed(() => props.openIndex === props.index);
  const bodyContentRef = ref<HTMLElement | null>(null);
  const bodyMaxHeight = ref("0px");

  const bodyStyles = computed(() => ({
    maxHeight: bodyMaxHeight.value,
  }));

  const updateBodyHeight = () => {
    const contentHeight = bodyContentRef.value?.scrollHeight ?? 0;
    bodyMaxHeight.value = isOpen.value ? `${contentHeight}px` : "0px";
  };

  const toggleOpen = async () => {
    emit("toggle", props.index);
    await nextTick();
    updateBodyHeight();
  };

  let resizeObserver: ResizeObserver | null = null;

  onMounted(async () => {
    await nextTick();
    updateBodyHeight();

    if (bodyContentRef.value && typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        updateBodyHeight();
      });
      resizeObserver.observe(bodyContentRef.value);
    }
  });

  onBeforeUnmount(() => {
    resizeObserver?.disconnect();
  });

  watch(
    () => [props.text, props.copy, props.openIndex],
    async () => {
      await nextTick();
      updateBodyHeight();
    }
  );
</script>

<template>
  <div class="accordion-item" :class="{ 'is-open': isOpen }">
    <button
      class="accordion-item__header"
      type="button"
      :aria-expanded="isOpen"
      @click="toggleOpen"
    >
      <span class="accordion-item__title">{{ title }}</span>
      <span v-if="amount !== null" class="accordion-item__amount">{{ amount }}</span>
      <div v-else class="accordion-item__amount-empty" aria-hidden="true" />
    </button>

    <div class="accordion-item__body" :style="bodyStyles">
      <div ref="bodyContentRef" class="accordion-item__body-content">
        <div class="accordion-item__icon" aria-hidden="true" />
        <p class="accordion-item__text">{{ text }}</p>
        <p class="accordion-item__copy text text-body-sm">{{ copy }}</p>
        <button class="accordion-item__button" type="button">
          {{ ctaText }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .accordion-item {
    border: 1px solid #d7d7d7;
    border-radius: 14px;
    overflow: hidden;
    background: #fff;

    &__header {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 16px 18px;
      background: transparent;
      border: 0;
      text-align: left;
      cursor: pointer;
    }

    &__title {
      font-size: 1rem;
      line-height: 1.3;
      font-weight: 600;
    }

    &__amount {
      font-size: 1rem;
      line-height: 1.3;
      font-weight: 700;
      white-space: nowrap;
    }

    &__amount-empty {
      width: 1px;
      height: 1px;
      flex-shrink: 0;
    }

    &__body {
      max-height: 0;
      overflow: hidden;
      transition: max-height 220ms ease;
      border-top: 1px solid transparent;
    }

    &__body-content {
      display: grid;
      gap: 12px;
      padding: 16px 18px 18px;
    }

    &__icon {
      width: 22px;
      height: 22px;
      background: #111;
      border-radius: 2px;
    }

    &__text {
      margin: 0;
      line-height: 1.5;
    }

    &__copy {
      margin: 0;
    }

    &__button {
      justify-self: start;
      border: 1px solid #111;
      background: #111;
      color: #fff;
      border-radius: 999px;
      padding: 8px 14px;
      font-size: 0.9rem;
      line-height: 1.2;
      cursor: pointer;
    }
  }

  .accordion-item.is-open {
    .accordion-item__body {
      border-top-color: #d7d7d7;
    }
  }
</style>
