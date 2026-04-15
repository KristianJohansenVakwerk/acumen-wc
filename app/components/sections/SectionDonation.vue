<script setup lang="ts">
  import type { SectionItem } from "../../../schemaTypes/sections";
  import type { AccordionEntry } from "../Accordion/Accordion.vue";
  import BackToDonation from "../BackToDonation/BackToDonation.vue";
  import DonationIllustration from "../illustrations/DonationIllustration.vue";
  import { onBeforeUnmount, onMounted, ref } from "vue";

  defineProps<{
    section: SectionItem;
  }>();

  const openId = ref<string | null>("theSuperSub");
  function onIllustrationClick(option: { id: string }) {
    openId.value = option.id;
  }

  const sectionEl = ref<HTMLElement | null>(null);
  const hasScrolledPastDonation = ref(false);

  let observer: IntersectionObserver | null = null;

  function scrollToDonation() {
    const el = sectionEl.value;
    if (!el) return;

    const offset = 20;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  }

  onMounted(() => {
    if (!sectionEl.value) return;

    observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;

        // "Scrolled past" means the section is fully above the viewport.
        const next =
          entry.intersectionRatio === 0 && entry.boundingClientRect.bottom <= 0;

        if (next !== hasScrolledPastDonation.value) {
          hasScrolledPastDonation.value = next;
        }
      },
      {
        threshold: [0],
      }
    );

    observer.observe(sectionEl.value);
  });

  onBeforeUnmount(() => {
    observer?.disconnect();
    observer = null;
  });
</script>

<template>
  <Teleport to="body">
    <BackToDonation :open="hasScrolledPastDonation" @click="scrollToDonation" />
  </Teleport>

  <div
    ref="sectionEl"
    class="section section-donation flex column gap-md md:gap-giga px-md md:px-giga lg:px-giga relative z-10"
  >
    <div class="container-md flex column gap-md md:gap-lg">
      <h2
        class="text text-display-lg text-display color-blue container-md md:text-align-center"
      >
        {{ section.props.title }}
      </h2>

      <RichText :richtext="section.props.richtext" />
    </div>

    <div
      class="section-donation__illustration grid-6 gap-lg md:gap-giga container"
    >
      <div class="span-6 lg:span-4 order-2 lg:order-1">
        <DonationIllustration :active-id="openId" @click="onIllustrationClick" />
      </div>
      <div class="span-6 lg:span-2 order-1 lg:order-2">
        <Accordion
          v-model:open-id="openId"
          :items="section.props.tiers as AccordionEntry[]"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .section-donation {
    &__illustration {
      width: 100%;
      height: auto;
    }
  }
</style>
