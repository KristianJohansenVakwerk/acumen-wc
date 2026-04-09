<script setup lang="ts">
  type RichTextBlock = {
    tag: "h3" | "p";
    text: string;
  };

  const props = defineProps<{
    richtext: RichTextBlock[] | undefined;
    h3Class?: string;
    pClass?: string;
  }>();

  const h3Class = props.h3Class ?? "text text-heading-sm text-black";
  const pClass = props.pClass ?? "text text-body";
</script>

<template>
  <template v-if="richtext && richtext.length">
    <component
      :is="block.tag"
      v-for="(block, index) in richtext"
      :key="`${index}-${block.tag}`"
      :class="block.tag === 'h3' ? h3Class : pClass"
    >
      {{ block.text }}
    </component>
  </template>
</template>
