<script setup lang="ts">
  import type { SectionItem } from "../../../schemaTypes/sections";
  import backline from "@/components/icons/backline.vue";
  import midfieldEngine from "@/components/icons/midfield-engine.vue";
  import superSub from "@/components/icons/super-sub.vue";
  import matchMvp from "@/components/icons/match-mvp.vue";
  import fan from "@/components/icons/fan.vue";
  import {
    computed,
    nextTick,
    onBeforeUnmount,
    onMounted,
    ref,
    watch,
  } from "vue";

  type BannerItem = {
    batch: string;
    name: string;
  };

  const props = defineProps<{
    section: SectionItem;
  }>();

  const { data, pending, error } = useFetch<BannerItem[]>("/api/banner", {
    default: () => [],
  });

  const speedPxPerSecond = computed(() => {
    const raw = (props.section.props as Record<string, unknown> | undefined)
      ?.speed;
    const value = typeof raw === "number" ? raw : Number(raw);
    return Number.isFinite(value) && value > 0 ? value : 80;
  });

  const containerEl = ref<HTMLElement | null>(null);
  const measureEl = ref<HTMLElement | null>(null);

  const repeatCount = ref(2);
  const durationSeconds = ref(20);

  function recompute() {
    const container = containerEl.value;
    const measure = measureEl.value;
    const items = data.value ?? [];
    if (!container || !measure || items.length === 0) return;

    const containerWidth = container.clientWidth;
    const baseWidth = measure.scrollWidth;
    if (baseWidth <= 0 || containerWidth <= 0) return;

    // Ensure one track is wider than the container, plus a little extra so
    // the seam isn't visible during the loop.
    const nextRepeat = Math.max(2, Math.ceil(containerWidth / baseWidth) + 1);
    repeatCount.value = nextRepeat;

    const trackWidth = baseWidth * nextRepeat;
    durationSeconds.value = trackWidth / speedPxPerSecond.value;
  }

  let ro: ResizeObserver | null = null;
  onMounted(() => {
    ro = new ResizeObserver(() => recompute());
    if (containerEl.value) ro.observe(containerEl.value);
    if (measureEl.value) ro.observe(measureEl.value);
    nextTick(() => recompute());
  });
  onBeforeUnmount(() => {
    ro?.disconnect();
    ro = null;
  });

  watch(
    () => data.value,
    async () => {
      await nextTick();
      recompute();
    },
  );

  watch(speedPxPerSecond, () => {
    recompute();
  });

  const repeatedItems = computed(() => {
    const items = data.value ?? [];
    const out: BannerItem[] = [];
    for (let i = 0; i < repeatCount.value; i++) out.push(...items);
    return out;
  });

  const checkBatchIcon = (name?: string) => {
    if (name === "backline") return backline;
    if (name === "midfield-engine") return midfieldEngine;
    if (name === "super-sub") return superSub;
    if (name === "match-mvp") return matchMvp;
    if (name === "fan") return fan;
    return null;
  };
</script>

<template>
  <div v-if="data?.length >= 5" class="section-banner">
    <div v-if="pending" class="section-banner__state container-md">
      Loading…
    </div>
    <div v-else-if="error" class="section-banner__state container-md">
      Failed to load
    </div>

    <div
      v-else
      ref="containerEl"
      class="marquee bg-blue color-white text text-body text-bold"
      :style="{ '--duration': `${durationSeconds}s` }"
    >
      <template v-if="(data?.length ?? 0) >= 5">
        <!-- Hidden, single-set measurement row -->
        <div ref="measureEl" class="marquee__measure" aria-hidden="true">
          <span
            v-for="(item, idx) in data"
            :key="`m-${idx}`"
            class="marquee__item"
          >
            <span class="marquee__batch">
              <component :is="checkBatchIcon(item.batch)" color="#FF3500" />
            </span>

            <span class="marquee__name"
              >{{ item.firstname }} {{ item.lastname }}</span
            >
          </span>
        </div>

        <!-- Animated loop: two identical tracks for seamless wrap -->
        <div class="marquee__inner" aria-label="Banner">
          <div class="marquee__track">
            <span
              v-for="(item, idx) in repeatedItems"
              :key="`a-${idx}`"
              class="marquee__item"
            >
              <span class="marquee__batch">
                <component :is="checkBatchIcon(item.batch)" color="#FF3500" />
              </span>
              <span class="marquee__name"
                >{{ item.firstname }} {{ item.lastname }}</span
              >
            </span>
          </div>
          <div class="marquee__track" aria-hidden="true">
            <span
              v-for="(item, idx) in repeatedItems"
              :key="`b-${idx}`"
              class="marquee__item"
            >
              <span class="marquee__batch">
                <component :is="checkBatchIcon(item.batch)" color="#FF3500" />
              </span>
              <span class="marquee__name"
                >{{ item.firstname }} {{ item.lastname }}</span
              >
            </span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .section-banner__state {
    padding: clamp(12px, 2vw, 18px) 0;
  }

  .marquee {
    position: relative;
    overflow: hidden;
    width: 100%;
    padding: clamp(12px, 2vw, 18px) 0;
  }

  .marquee__inner {
    display: flex;
    width: max-content;
    will-change: transform;
    animation: marquee var(--duration, 20s) linear infinite;

    &:hover {
      animation-play-state: paused;
    }
  }

  .marquee__track {
    display: flex;
    align-items: center;
    gap: clamp(12px, 2vw, 23px);
    padding-right: clamp(12px, 2vw, 23px);
    white-space: nowrap;
  }

  .marquee__item {
    display: inline-flex;
    align-items: center;
    gap: clamp(12px, 1vw, 24px);
  }

  .marquee__batch {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .marquee__name {
    opacity: 0.9;
  }

  .marquee__measure {
    position: absolute;
    visibility: hidden;
    pointer-events: none;
    white-space: nowrap;
    display: flex;
    gap: clamp(12px, 2vw, 28px);
  }

  @keyframes marquee {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-50%);
    }
  }
</style>
