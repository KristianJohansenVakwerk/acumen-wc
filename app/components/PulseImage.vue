<script setup lang="ts">
  type SpeedProp = number | `${number}s` | `${number}ms`;

  const props = withDefaults(
    defineProps<{
      src: string;
      alt?: string;
      /** Scale at the peak of the pulse, e.g. 1.15 */
      scale?: number;
      /**
       * Animation duration. Accepts seconds number (e.g. 1.2), or a CSS time
       * like "1200ms" / "1.2s".
       */
      speed?: SpeedProp;
      width?: number | string;
      height?: number | string;
    }>(),
    {
      alt: "",
      scale: 1.15,
      speed: 1.2,
    }
  );

  function toCssTime(v: SpeedProp): string {
    if (typeof v === "number") return `${v}s`;
    return v;
  }
</script>

<template>
  <NuxtImg
    class="pulse-image"
    :src="props.src"
    :alt="props.alt"
    :style="{
      '--pulse-scale': String(props.scale),
      '--pulse-speed': toCssTime(props.speed),
      width: props.width,
      height: props.height,
    }"
  />
</template>

<style scoped lang="scss">
  .pulse-image {
    transform-origin: center;
    animation: pulse-image var(--pulse-speed, 1.2s) ease-in-out infinite;
    will-change: transform;
  }

  @keyframes pulse-image {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(var(--pulse-scale, 1.15));
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .pulse-image {
      animation: none;
    }
  }
</style>
