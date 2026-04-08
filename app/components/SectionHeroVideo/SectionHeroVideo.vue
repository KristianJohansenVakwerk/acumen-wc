<script setup lang="ts">
  import VideoLoop from "@/components/VideoLoop.vue";
  import { onBeforeUnmount, onMounted, ref } from "vue";

  defineProps<{
    videoSrc: string;
    /** Hero image alt / accessibility (section title). */
    title?: string;
    /** Main hero headline next to the icon. */
    subhead?: string;
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
    if (!gsap || !root || !left || !right) return;

    ctx = gsap.context(() => {
      let lastHeaderLogoVisible: boolean | null = null;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: () => `+=${Math.round(window.innerHeight * 0.85)}`,
          scrub: 0.45,
          invalidateOnRefresh: true,
          snap: {
            snapTo: (value: number) => (value < scrollCommitThreshold ? 0 : 1),
            duration: { min: 0.28, max: 0.75 },
            delay: 0.14,
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
      <div ref="layerLeftRef" class="section-hero-video__layer">
        <VideoLoop
          v-if="videoSrc"
          :src="videoSrc"
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

      <div ref="layerRightRef" class="section-hero-video__layer">
        <VideoLoop
          v-if="videoSrc"
          :src="videoSrc"
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

    &__layer {
      position: absolute;
      inset: 0;
      will-change: transform;
    }

    &__overlay {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      bottom: 0;
      padding: 0 0 40px 30px;
      z-index: 1;
    }

    &__overlay-right {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
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
      width: 100px;
      height: auto;
    }

    &__icon {
      display: block;
      width: 245px;
      height: auto;
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
