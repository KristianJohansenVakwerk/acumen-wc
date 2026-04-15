<script setup lang="ts">
  import VideoLoop from "@/components/VideoLoop.vue";
  import { onBeforeUnmount, onMounted, ref } from "vue";

  const props = defineProps<{
    videoSrc: string;
    videoPoster?: string;
    /** Hero image alt / accessibility (section title). */
    title?: string;
    /** Main hero headline next to the icon. */
    subhead?: string;
    /**
     * Optional element whose document offsetTop should be used as the ScrollTrigger end.
     * Useful to align the "open" point with where the header logo sits in the layout.
     */
    scrollEndEl?: HTMLElement | null;
  }>();

  const emit = defineEmits<{
    /** Fired when hero scroll progress opens (done) or returns (reversed); parent can toggle header logo. */
    "header-logo-visible": [visible: boolean];
  }>();

  /** Hysteresis for header logo: avoid flicker while scrub hovers near the middle. */
  const headerLogoOpenProgress = 0.97;
  const headerLogoClosedProgress = 0.97;

  const rootRef = ref<HTMLElement | null>(null);
  const layerTopRef = ref<HTMLElement | null>(null);
  const layerBottomRef = ref<HTMLElement | null>(null);

  let ctx: { revert: () => void } | null = null;
  /** Set when the hero ScrollTrigger is created; used to scroll to the same “open” position as the scrub range end. */
  let heroScrollTrigger: { end: number } | null = null;
  let removeMagnetScrollListeners: (() => void) | null = null;
  let isAutoScrolling = false;
  let lastTouchY: number | null = null;
  const TOP_TRIGGER_PX = 48;
  const END_DEADZONE_PX = 8;

  function getDocumentOffsetTop(el: HTMLElement): number {
    let top = 0;
    let node: HTMLElement | null = el;
    while (node) {
      top += node.offsetTop;
      node = node.offsetParent as HTMLElement | null;
    }
    return top;
  }

  function clampNonNegative(n: number) {
    return n < 0 ? 0 : n;
  }

  function scrollHeroOpen() {
    const st = heroScrollTrigger;
    if (!st) return;
    isAutoScrolling = true;
    window.scrollTo({ top: st.end, behavior: "smooth" });
    window.setTimeout(() => {
      isAutoScrolling = false;
    }, 650);
  }

  function scrollHeroClosed() {
    isAutoScrolling = true;
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.setTimeout(() => {
      isAutoScrolling = false;
    }, 650);
  }

  onMounted(() => {
    const { gsap } = useGSAP();
    const root = rootRef.value;
    const top = layerTopRef.value;
    const bottom = layerBottomRef.value;
    const videoHeight = rootRef.value?.clientHeight ?? 0;
    if (!gsap || !root || !top || !bottom || !videoHeight) return;

    ctx = gsap.context(() => {
      let lastHeaderLogoVisible: boolean | null = null;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: () => {
            const el = props.scrollEndEl;
            if (el) {
              // Mobile: keep 25px breathing room from the viewport top.
              return clampNonNegative(getDocumentOffsetTop(el) - 25);
            }
            return `+=411px`;
          },
          scrub: 0.45,
          invalidateOnRefresh: true,
          onUpdate(self) {
            const p = self.progress;
            let next: boolean | null = null;
            if (p >= headerLogoOpenProgress) next = true;
            else if (p <= headerLogoClosedProgress) next = false;
            if (next === null || next === lastHeaderLogoVisible) return;
            lastHeaderLogoVisible = next;
            emit("header-logo-visible", next);
          },
        },
      });

      tl.to(top, { y: "-110vh", ease: "none" }, 0);
      tl.to(bottom, { y: "110vh", ease: "none" }, 0);

      heroScrollTrigger = tl.scrollTrigger ?? null;

      const getHeroEnd = () => heroScrollTrigger?.end ?? 0;
      const atTop = () => window.scrollY <= TOP_TRIGGER_PX;
      const withinHeroRange = () =>
        window.scrollY > TOP_TRIGGER_PX &&
        window.scrollY < getHeroEnd() - END_DEADZONE_PX;

      const onWheel = (e: WheelEvent) => {
        if (isAutoScrolling) return;
        if (e.deltaY > 0 && atTop()) {
          e.preventDefault();
          scrollHeroOpen();
        } else if (e.deltaY < 0 && withinHeroRange()) {
          e.preventDefault();
          scrollHeroClosed();
        }
      };

      const onTouchStart = (e: TouchEvent) => {
        lastTouchY = e.touches?.[0]?.clientY ?? null;
      };
      const onTouchMove = (e: TouchEvent) => {
        if (isAutoScrolling) return;
        const y = e.touches?.[0]?.clientY;
        if (y == null || lastTouchY == null) return;
        const deltaY = lastTouchY - y; // >0 means user swiped up (scrolling down)
        lastTouchY = y;
        if (deltaY > 0 && atTop()) {
          e.preventDefault();
          scrollHeroOpen();
        } else if (deltaY < 0 && withinHeroRange()) {
          e.preventDefault();
          scrollHeroClosed();
        }
      };

      const onKeyDown = (e: KeyboardEvent) => {
        if (isAutoScrolling) return;
        const down =
          e.key === "ArrowDown" ||
          e.key === "PageDown" ||
          e.key === " " ||
          e.key === "Spacebar";
        const up = e.key === "ArrowUp" || e.key === "PageUp";
        if (down && atTop()) scrollHeroOpen();
        else if (up && withinHeroRange()) scrollHeroClosed();
      };

      window.addEventListener("wheel", onWheel, { passive: false });
      window.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("touchmove", onTouchMove, { passive: false });
      window.addEventListener("keydown", onKeyDown);
      removeMagnetScrollListeners = () => {
        window.removeEventListener("wheel", onWheel);
        window.removeEventListener("touchstart", onTouchStart);
        window.removeEventListener("touchmove", onTouchMove);
        window.removeEventListener("keydown", onKeyDown);
      };
    }, root);
  });

  onBeforeUnmount(() => {
    emit("header-logo-visible", false);
    heroScrollTrigger = null;
    removeMagnetScrollListeners?.();
    removeMagnetScrollListeners = null;
    ctx?.revert();
    ctx = null;
  });
</script>

<template>
  <div>
    <div ref="rootRef" class="section-hero-video relative">
      <div
        ref="layerTopRef"
        class="section-hero-video__layer section-hero-video__layer__top"
      >
        <VideoLoop
          v-if="videoSrc"
          :src="videoSrc"
          :poster="videoPoster"
          video-class="cover absolute top-0 left-0 w-full h-full section-hero-video__video section-hero-video__video__1 z-1"
        />

        <div
          class="section-hero-video__overlay flex column items-center justify-center"
        >
          <img
            class="section-hero-video__icon mb-lg"
            src="/_include/icons/hero_icon.svg"
            :alt="title ?? ''"
          />
          <h1
            class="text text-heading-xl text-black color-white text-align-center px-md"
          >
            {{ subhead }}
          </h1>
        </div>
      </div>

      <div
        ref="layerBottomRef"
        class="section-hero-video__layer section-hero-video__layer__bottom"
      >
        <VideoLoop
          v-if="videoSrc"
          :src="videoSrc"
          :poster="videoPoster"
          video-class="cover absolute top-0 left-0 w-full h-full section-hero-video__video section-hero-video__video__2"
        />

        <div
          class="section-hero-video__overlay-right flex row justify-space-between items-center py-md px-md"
        >
          <div
            class="section-hero-video__swipe-cta flex column items-center justify-center gap"
            role="button"
            tabindex="0"
            style="pointer-events: all"
            @click="scrollHeroOpen"
            @keydown.enter.prevent="scrollHeroOpen"
            @keydown.space.prevent="scrollHeroOpen"
          >
            <span class="text text-body text-bold color-white">Swipe down</span>
            <PulseImage
              src="/_include/icons/fan.svg"
              alt=""
              :scale="1.18"
              :speed="1.1"
              style="width: 28px; height: auto"
            />
          </div>

          <NuxtImg
            class="section-hero-video__logo"
            src="/_include/ui/Acumen-Logo-Top.svg"
            alt="Acumen"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .section-hero-video {
    aspect-ratio: 313/454;
    // overflow: hidden;
    // pointer-events: none;

    &__layer {
      position: absolute;
      inset: 0;
      will-change: transform;
      width: calc(100%);
      margin: 0 auto;
    }

    &__overlay {
      position: absolute;
      width: 100%;
      height: calc(75.55%);
      left: 0;
      top: 0%;

      padding: 0 0 25px;
      z-index: 1;
    }

    &__overlay-right {
      position: absolute;
      left: 0;
      bottom: 0%;
      height: calc(24.44%);
      width: 100%;

      z-index: 1;
    }

    &__swipe-cta {
      cursor: pointer;
      user-select: none;

      &:focus-visible {
        outline: 2px solid currentColor;
        outline-offset: 4px;
        border-radius: 4px;
      }
    }

    &__logo {
      width: 50px;
      height: auto;
    }

    &__icon {
      display: block;
      width: 112px;
      height: auto;
    }

    &__video {
      &__1 {
        -webkit-mask-image: url("/_include/ui/video-mask-top-mobile.svg");
        mask-image: url("/_include/ui/video-mask-top-mobile.svg");
        mask-repeat: no-repeat;
        -webkit-mask-size: 100% 76.55%;
        mask-size: 100% 76.55%;
        mask-position: left top;
      }
      &__2 {
        -webkit-mask-image: url("/_include/ui/video-mask-bottom-mobile.svg");
        mask-image: url("/_include/ui/video-mask-bottom-mobile.svg");
        mask-repeat: no-repeat;
        -webkit-mask-size: 100% 24.44%;
        mask-size: 100% 24.44%;
        mask-position: left bottom;
      }
    }
  }
</style>
