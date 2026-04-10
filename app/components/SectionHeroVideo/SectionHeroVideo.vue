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

  /** Past this scroll progress (0–1) along the hero range, release “commits” open; below snaps back closed. */
  const scrollCommitThreshold = 0.1;

  /** Hysteresis for header logo: avoid flicker while scrub hovers near the middle. */
  const headerLogoOpenProgress = 0.97;
  const headerLogoClosedProgress = 0.97;

  const rootRef = ref<HTMLElement | null>(null);
  const layerLeftRef = ref<HTMLElement | null>(null);
  const layerRightRef = ref<HTMLElement | null>(null);

  let ctx: { revert: () => void } | null = null;
  /** Set when the hero ScrollTrigger is created; used to scroll to the same “open” position as the scrub range end. */
  let heroScrollTrigger: { end: number } | null = null;

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
    window.scrollTo({ top: st.end, behavior: "smooth" });
  }

  onMounted(() => {
    const { gsap } = useGSAP();
    const root = rootRef.value;
    const left = layerLeftRef.value;
    const right = layerRightRef.value;
    const videoHeight = rootRef.value?.clientHeight ?? 0;
    if (!gsap || !root || !left || !right || !videoHeight) return;

    ctx = gsap.context(() => {
      let lastHeaderLogoVisible: boolean | null = null;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: () => {
            const el = props.scrollEndEl;
            if (el) {
              // Desktop: keep 50px breathing room from the viewport top.
              return clampNonNegative(getDocumentOffsetTop(el) - 50);
            }
            return `+=${Math.round(videoHeight + 100)}`;
          },
          scrub: 0.45,
          invalidateOnRefresh: true,
          snap: {
            snapTo: (value: number) => (value < scrollCommitThreshold ? 0 : 1),
            duration: { min: 0.28, max: 0.5 },
            delay: 0.1,
            ease: "power2.inOut",
            inertia: false,
          },
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

      tl.to(left, { x: "-110vw", ease: "none" }, 0);
      tl.to(right, { x: "110vw", ease: "none" }, 0);

      heroScrollTrigger = tl.scrollTrigger ?? null;
    }, root);
  });

  onBeforeUnmount(() => {
    emit("header-logo-visible", false);
    heroScrollTrigger = null;
    ctx?.revert();
    ctx = null;
  });
</script>

<template>
  <div>
    <div ref="rootRef" class="section-hero-video relative">
      <div
        ref="layerLeftRef"
        class="section-hero-video__layer section-hero-video__layer__left"
      >
        <VideoLoop
          v-if="videoSrc"
          :src="videoSrc"
          :poster="videoPoster"
          video-class="cover absolute top-0 left-0 w-full h-full section-hero-video__video section-hero-video__video__1 z-1"
        />

        <div class="section-hero-video__overlay flex row items-end">
          <div>
            <img
              class="section-hero-video__icon mb-lg"
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
        ref="layerRightRef"
        class="section-hero-video__layer section-hero-video__layer__right"
      >
        <VideoLoop
          v-if="videoSrc"
          :src="videoSrc"
          :poster="videoPoster"
          video-class="cover absolute top-0 left-0 w-full h-full section-hero-video__video section-hero-video__video__2"
        />

        <div
          class="section-hero-video__overlay-right flex column gap-md justify-space-between items-center py-md"
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
            <NuxtImg
              src="/_include/icons/fan.svg"
              alt=""
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
    aspect-ratio: 1307/600;
    overflow: hidden;
    pointer-events: none;

    &__layer {
      position: absolute;
      inset: 0;
      will-change: transform;
      width: calc(100% - 64px);
      margin: 0 auto;

      @include lg-up {
        width: calc(100% - 128px);
      }
    }

    &__overlay {
      position: absolute;
      width: 81.1%;
      height: calc(100% - 64px);
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      padding: 0 0 40px 30px;
      z-index: 1;
    }

    &__overlay-right {
      position: absolute;
      top: 0;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      height: calc(100% - 64px);
      width: 19.1%;
      padding-bottom: 40px;
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

      @include lg-up {
        width: 100px;
      }
    }

    &__icon {
      display: block;
      width: 112px;
      height: auto;

      @include lg-up {
        width: 245px;
      }
    }

    &__video {
      &__1 {
        -webkit-mask-image: url("/_include/ui/video-mask-left.svg");
        mask-image: url("/_include/ui/video-mask-left.svg");
        mask-repeat: no-repeat;
        -webkit-mask-size: 81.1% 100%;
        mask-size: 81.1% 100%;
        mask-position: left center;
      }
      &__2 {
        -webkit-mask-image: url("/_include/ui/video-mask-right.svg");
        mask-image: url("/_include/ui/video-mask-right.svg");
        mask-repeat: no-repeat;
        -webkit-mask-size: 19.1% 100%;
        mask-size: 19.1% 100%;
        mask-position: right center;
      }
    }
  }
</style>
