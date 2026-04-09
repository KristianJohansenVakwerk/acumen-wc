<script setup lang="ts">
  import {
    computed,
    nextTick,
    onBeforeUnmount,
    onMounted,
    ref,
    watch,
  } from "vue";

  const props = defineProps<{
    id: string;
    title: string;
    amount: number | string | null;
    tierBg: string;
    tierIcon: string;
    copy: string;
    ctaText: string;
    icon: string;
    openId: string | null;
  }>();

  const emit = defineEmits<{
    (e: "toggle", value: string): void;
  }>();

  const isOpen = computed(() => props.openId === props.id);
  const bodyContentRef = ref<HTMLElement | null>(null);
  const bodyMaxHeight = ref("0px");
  const rafId = ref<number | null>(null);

  const bodyStyles = computed(() => ({
    maxHeight: bodyMaxHeight.value,
  }));

  const bgClass = computed(() => `bg-${props.tierBg}`);

  const cancelRaf = () => {
    if (rafId.value !== null) {
      cancelAnimationFrame(rafId.value);
      rafId.value = null;
    }
  };

  const getContentHeightPx = () => {
    const el = bodyContentRef.value;
    if (!el) return "0px";
    return `${el.scrollHeight}px`;
  };

  const updateBodyHeight = () => {
    // iOS Safari can miss the transition if max-height changes too quickly.
    // Scheduling the write ensures the "from" style is committed first.
    cancelRaf();
    rafId.value = requestAnimationFrame(() => {
      bodyMaxHeight.value = isOpen.value ? getContentHeightPx() : "0px";
      rafId.value = null;
    });
  };

  const toggleOpen = async () => {
    emit("toggle", props.id);
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
    cancelRaf();
    resizeObserver?.disconnect();
  });

  watch(
    () => [props.copy, props.openId],
    async () => {
      await nextTick();
      updateBodyHeight();
    }
  );

  const onBodyMediaLoad = async () => {
    // NuxtImg/image load can change scrollHeight after initial measurement,
    // and ResizeObserver isn't always reliable across Safari versions.
    await nextTick();
    updateBodyHeight();
  };
</script>

<template>
  <div class="accordion-item color-white" :class="{ 'is-open': isOpen }">
    <button
      class="accordion-item__header debug"
      :class="bgClass"
      type="button"
      :aria-expanded="isOpen"
      @click="toggleOpen"
    >
      <span class="accordion-item__title-wrap">
        <NuxtImg
          v-if="icon"
          class="accordion-item__tier-icon"
          :src="icon"
          alt=""
          width="16"
          height="16"
        />
        <span class="accordion-item__title text text-body text-bold">{{
          title
        }}</span>
      </span>
      <span
        v-if="amount !== null"
        class="accordion-item__amount text text-body text-bold"
        >${{ amount }} USD</span
      >
      <div v-else class="accordion-item__amount-empty" aria-hidden="true" />
    </button>

    <div class="accordion-item__body" :class="bgClass" :style="bodyStyles">
      <div
        ref="bodyContentRef"
        class="accordion-item__body-content flex column gap-lg justify-center items-center"
      >
        <NuxtImg
          v-if="icon"
          class="accordion-item__body-content__icon"
          :src="icon"
          alt=""
          width="90"
          height="90"
          @load="onBodyMediaLoad"
        />
        <p class="accordion-item__copy text text-body text-bold">
          {{ copy }}
        </p>
        <button
          class="accordion-item__button bg-white color-black text text-heading-sm text-black hover:color-white border-1 border-white transition-all duration-default"
          :class="`hover:bg-${tierBg}`"
          type="button"
        >
          {{ ctaText }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .accordion-item {
    overflow: hidden;

    &__header {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 16px 18px;
      border: 0;
      text-align: left;
      cursor: pointer;
      color: inherit;
      border-radius: 15px;
      // border-bottom: 3px dashed black
    }

    &__title-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }

    &__tier-icon {
      width: 16px;
      height: auto;
      flex-shrink: 0;
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
      will-change: max-height;
      border-radius: 15px;
    }

    &__body-content {
      &__icon {
        width: 90px;
        height: 90px;
        object-fit: contain;
      }

      padding: 16px 18px 18px;
    }

    &__icon {
      width: 22px;
      height: 22px;
      background: #111;
      border-radius: 2px;
    }

    &__copy {
      margin: 0;
    }

    &__button {
      justify-self: start;
      border-radius: 999px;
      padding: 10px 15px 8px 15px;
      line-height: 1;

      min-width: 200px;
      cursor: pointer;
    }
  }
</style>
