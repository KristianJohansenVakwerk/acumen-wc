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
  const layerARef = ref<HTMLElement | null>(null);
  const layerBRef = ref<HTMLElement | null>(null);

  let ctx: { revert: () => void } | null = null;
  /** Set when the hero ScrollTrigger is created; used to scroll to the same “open” position as the scrub range end. */
  let heroScrollTrigger: { end: number } | null = null;
  let removeMagnetScrollListeners: (() => void) | null = null;
  let isAutoScrolling = false;
  let lastTouchY: number | null = null;
  const TOP_TRIGGER_PX = 48;
  const END_DEADZONE_PX = 8;

  const BREAKPOINT_SM_PX = 640;

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
    const a = layerARef.value;
    const b = layerBRef.value;
    const videoHeight = rootRef.value?.clientHeight ?? 0;
    if (!gsap || !root || !a || !b || !videoHeight) return;

    ctx = gsap.context(() => {
      let lastHeaderLogoVisible: boolean | null = null;

      const mm = gsap.matchMedia();

      const createTimeline = (axis: "x" | "y") => {
        const endOffset = axis === "y" ? 25 : 50;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: () => {
              const el = props.scrollEndEl;
              if (el)
                return clampNonNegative(getDocumentOffsetTop(el) - endOffset);
              return `+=${Math.round(videoHeight + 100)}`;
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

        tl.to(a, { x: "-110vw", ease: "none" }, 0);
        tl.to(b, { x: "110vw", ease: "none" }, 0);

        heroScrollTrigger = tl.scrollTrigger ?? null;
        return tl;
      };

      // Mobile / touch-first behavior (no desktop wheel interception).
      mm.add(`(max-width: ${BREAKPOINT_SM_PX - 1}px)`, () => {
        createTimeline("y");

        const getHeroEnd = () => heroScrollTrigger?.end ?? 0;
        const atTop = () => window.scrollY <= TOP_TRIGGER_PX;
        const withinHeroRange = () =>
          window.scrollY > TOP_TRIGGER_PX &&
          window.scrollY < getHeroEnd() - END_DEADZONE_PX;

        const onWheel = (e: WheelEvent) => {
          // No preventDefault on wheel: keep Safari/macOS scrolling safe.
          if (isAutoScrolling) return;
          if (e.deltaY > 0 && atTop()) {
            scrollHeroOpen();
          } else if (e.deltaY < 0 && withinHeroRange()) {
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

          if (!e.cancelable) return;
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

        window.addEventListener("wheel", onWheel, { passive: true });
        window.addEventListener("touchstart", onTouchStart, { passive: true });
        window.addEventListener("touchmove", onTouchMove, { passive: false });
        window.addEventListener("keydown", onKeyDown);

        removeMagnetScrollListeners = () => {
          window.removeEventListener("wheel", onWheel);
          window.removeEventListener("touchstart", onTouchStart);
          window.removeEventListener("touchmove", onTouchMove);
          window.removeEventListener("keydown", onKeyDown);
        };

        return () => {
          removeMagnetScrollListeners?.();
          removeMagnetScrollListeners = null;
        };
      });

      // Desktop / mouse-wheel: never prevent native scroll.
      mm.add(`(min-width: ${BREAKPOINT_SM_PX}px)`, () => {
        createTimeline("x");

        const getHeroEnd = () => heroScrollTrigger?.end ?? 0;
        const atTop = () => window.scrollY <= TOP_TRIGGER_PX;
        const withinHeroRange = () =>
          window.scrollY > TOP_TRIGGER_PX &&
          window.scrollY < getHeroEnd() - END_DEADZONE_PX;

        const onWheel = (e: WheelEvent) => {
          // No preventDefault: preserve native scroll (Safari safety).
          if (isAutoScrolling) return;
          if (e.deltaY > 0 && atTop()) {
            scrollHeroOpen();
          } else if (e.deltaY < 0 && withinHeroRange()) {
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

        window.addEventListener("wheel", onWheel, { passive: true });
        window.addEventListener("keydown", onKeyDown);

        removeMagnetScrollListeners = () => {
          window.removeEventListener("wheel", onWheel);
          window.removeEventListener("keydown", onKeyDown);
        };

        return () => {};
      });

      removeMagnetScrollListeners = () => {
        mm.revert();
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
        ref="layerARef"
        class="section-hero-video__layer section-hero-video__layer__a"
      >
        <VideoLoop
          v-if="videoSrc"
          :src="videoSrc"
          :poster="videoPoster"
          video-class="cover absolute top-0 left-0 w-full h-full section-hero-video__video section-hero-video__video__1 z-1"
        />

        <!-- Mobile overlay -->
        <div
          class="section-hero-video__overlay section-hero-video__overlay--mobile flex column items-center justify-center"
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

        <!-- Desktop overlay (left panel) -->
        <div
          class="section-hero-video__overlay section-hero-video__overlay--desktop-left flex row items-end"
        >
          <div>
            <img
              class="section-hero-video__icon mb-lg md:mb-md"
              src="/_include/icons/hero_icon.svg"
              :alt="title ?? ''"
            />
            <h1 class="text text-heading-xl text-black color-white">
              {{ subhead }}
            </h1>
          </div>
        </div>
      </div>

      <div
        ref="layerBRef"
        class="section-hero-video__layer section-hero-video__layer__b"
      >
        <VideoLoop
          v-if="videoSrc"
          :src="videoSrc"
          :poster="videoPoster"
          video-class="cover absolute top-0 left-0 w-full h-full section-hero-video__video section-hero-video__video__2"
        />

        <!-- Mobile bottom bar -->
        <div
          class="section-hero-video__overlay-right section-hero-video__overlay-right--mobile flex row justify-space-between items-center py-md px-md"
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

        <!-- Desktop right rail -->
        <div
          class="section-hero-video__overlay-right section-hero-video__overlay-right--desktop flex column gap-md justify-space-between items-center py-md"
        >
          <NuxtImg
            class="section-hero-video__logo"
            src="/_include/ui/Acumen-Logo-Top.svg"
            alt="Acumen"
          />

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
              :scale="1.3"
              :speed="0.8"
              style="width: 48px; height: auto"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .section-hero-video {
    aspect-ratio: 313.2/455;
    overflow: hidden;
    // pointer-events: none;
    width: calc(100% - 50px);
    height: auto;
    margin: 0 auto;

    .text.text-heading-xl {
      @include md-up {
        font-size: 4vw;
      }
    }

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
      height: 75.6043956044%;
      left: 0;
      top: 0;
      padding: 0 0 25px;
      z-index: 1;
    }

    &__overlay-right {
      position: absolute;
      left: 0;
      bottom: 0;
      height: 24.3956043956%;
      width: 100%;
      z-index: 1;
    }

    &__swipe-cta {
      cursor: pointer;
      user-select: none;

      &:focus-visible {
        outline: 2px solid transparent;
        outline-offset: 2px;
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
        -webkit-mask-size: 100% 75.6043956044;
        mask-size: 100% 75.6043956044%;
        mask-position: left top;
        transform: translateY(1px);
      }
      &__2 {
        -webkit-mask-image: url("/_include/ui/video-mask-bottom-mobile.svg");
        mask-image: url("/_include/ui/video-mask-bottom-mobile.svg");
        mask-repeat: no-repeat;
        -webkit-mask-size: 100% 24.3956043956%;
        mask-size: 100% 24.3956043956%;
        mask-position: left bottom;
      }
    }

    // Show mobile overlays by default.
    &__overlay--desktop-left,
    &__overlay-right--desktop {
      display: none;
    }

    $vm-desktop-left-width: 80.9451219512%;
    $vm-desktop-right-width: 19.05487804878%;

    @include sm-up {
      aspect-ratio: 1312/600;
      width: calc(100% - 64px);

      @include lg-up {
        width: calc(100% - 128px);
      }

      &__layer {
        // @include lg-up {
        //   width: calc(100% - 128px);
        // }
      }

      &__overlay {
        width: $vm-desktop-left-width;
        height: calc(100% - 64px);

        top: 50%;
        transform: translateY(-50%);
        padding: 0 0 2.7vw 2vw;
      }

      &__overlay-right {
        right: 0;
        left: auto;
        bottom: auto;
        top: 50%;
        transform: translateY(-50%);
        height: calc(100% - 64px);
        width: $vm-desktop-right-width;
        padding-bottom: 40px;
      }

      &__logo {
        @include lg-up {
          width: 100px;
        }
      }

      &__icon {
        // width: 5vw;
        @include lg-up {
          width: 15vw;
        }
        @include xl-up {
          width: 245px;
        }
      }

      &__video {
        &__1 {
          -webkit-mask-image: url("/_include/ui/video-mask-left_2.svg");
          mask-image: url("/_include/ui/video-mask-left_2.svg");
          -webkit-mask-size: $vm-desktop-left-width 100%;
          mask-size: $vm-desktop-left-width 100%;
          mask-position: left center;
          transform: translateY(0px);
        }
        &__2 {
          -webkit-mask-image: url("/_include/ui/video-mask-right.svg");
          mask-image: url("/_include/ui/video-mask-right.svg");
          -webkit-mask-size: $vm-desktop-right-width 100%;
          mask-size: $vm-desktop-right-width 100%;
          mask-position: right center;
        }
      }

      // Toggle desktop overlays at sm-up.
      &__overlay--mobile,
      &__overlay-right--mobile {
        display: none;
      }
      &__overlay--desktop-left,
      &__overlay-right--desktop {
        display: flex;
      }
    }
  }
</style>
