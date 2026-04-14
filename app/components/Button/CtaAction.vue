<script setup lang="ts">
  import { computed } from "vue";

  type CtaType = "button" | "link";

  defineOptions({ inheritAttrs: false });

  const props = withDefaults(
    defineProps<{
      type?: CtaType;
      unstyled?: boolean;
      /**
       * Replace the default utility-class styling (not additive).
       * Use `unstyled` if you want to remove *all* defaults.
       */
      baseClass?: string | null;
      /**
       * Adds `cta-action--{modifier}` class(es) for variants.
       */
      modifier?: string | string[] | null;
      href?: string | null;
      target?: string | null;
      rel?: string | null;
      buttonType?: "button" | "submit" | "reset";
    }>(),
    {
      type: "button",
      unstyled: false,
      baseClass: null,
      modifier: null,
      href: null,
      target: null,
      rel: null,
      buttonType: "button",
    }
  );

  defineEmits<{
    (e: "click", evt: MouseEvent): void;
  }>();

  const defaultBaseClass =
    "bg-white hover:bg-transparent color-black text text-subheading text-black hover:color-white border-1 border-white transition-all duration-default";

  const modifierClasses = computed(() => {
    if (!props.modifier) return [];
    const mods = Array.isArray(props.modifier)
      ? props.modifier
      : [props.modifier];
    return mods.filter(Boolean).map((m) => `cta-action--${m}`);
  });

  const finalClass = computed(() => {
    if (props.unstyled) return [];

    const base = props.baseClass ?? defaultBaseClass;
    return ["cta-action", ...modifierClasses.value, base];
  });
</script>

<template>
  <a
    v-if="type === 'link'"
    v-bind="$attrs"
    :href="href ?? undefined"
    :target="target ?? undefined"
    :rel="rel ?? undefined"
    :class="finalClass"
  >
    <slot />
  </a>
  <button
    v-else
    v-bind="$attrs"
    :type="buttonType"
    :class="finalClass"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<style scoped lang="scss">
  .cta-action {
    justify-self: start;
    border-radius: 999px;
    padding: 10px 15px 8px 15px;
    line-height: 1;
    min-width: 200px;
    width: fit-content;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
