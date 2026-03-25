<script setup lang="ts">
  const colors = [
    { name: "$color-black-base", value: "#000000" },
    { name: "$color-white-base", value: "#ffffff" },
    { name: "$color-blue-primary", value: "#002f71" },
    { name: "$color-cyan", value: "#00a0cc" },
    { name: "$color-green-dark", value: "#064f23" },
    { name: "$color-green", value: "#087323" },
    { name: "$color-green-alt", value: "#097324" },
    { name: "$color-blue-accent", value: "#2a6eeb" },
    { name: "$color-indigo", value: "#2c2cb8" },
    { name: "$color-purple-dark", value: "#4f005e" },
    { name: "$color-mint", value: "#a4e2c7" },
    { name: "$color-red-dark", value: "#ce242b" },
    { name: "$color-grey", value: "#d9d9d9" },
    { name: "$color-orange", value: "#e45313" },
    { name: "$color-magenta-base", value: "#e52d87" },
    { name: "$color-grey-light", value: "#e8f0f7" },
    { name: "$color-yellow-base", value: "#fdca00" },
    { name: "$color-red", value: "#ff0000" },
    { name: "$color-red-bright", value: "#ff3500" },
  ];

  const frameworkColors = [
    { name: "$color-primary", value: "#002f71" },
    { name: "$color-secondary", value: "#e52d87" },
    { name: "$color-accent", value: "#fdca00" },
    { name: "$color-info", value: "#00a0cc" },
    { name: "$color-success", value: "#087323" },
    { name: "$color-success-dark", value: "#064f23" },
    { name: "$color-danger", value: "#ff0000" },
    { name: "$color-danger-dark", value: "#ce242b" },
    { name: "$color-warning", value: "#e45313" },
    { name: "$color-neutral", value: "#d9d9d9" },
    { name: "$color-neutral-light", value: "#e8f0f7" },
  ];

  const textUtilities = [
    {
      name: "caption",
      label: "Caption (12/13)",
      classes: "text text-caption text-bold debug",
    },
    {
      name: "label",
      label: "Label (14/16)",
      classes: "text text-label text-bold debug",
    },
    {
      name: "body-sm",
      label: "Body Small (16/18)",
      classes: "text text-body-sm text-bold debug",
    },
    {
      name: "body",
      label: "Body (20/22)",
      classes: "text text-body text-bold debug",
    },
    {
      name: "subheading",
      label: "Subheading (24/27)",
      classes: "text text-subheading text-bold debug",
    },
    {
      name: "heading-sm-tight",
      label: "Heading Small Tight (32/35)",
      classes: "text text-heading-sm-tight text-bold debug",
    },
    {
      name: "heading-sm",
      label: "Heading Small (32/36)",
      classes: "text text-heading-sm text-bold debug",
    },
    {
      name: "heading-md",
      label: "Heading Medium (40/45)",
      classes: "text text-heading-md text-bold debug",
    },
    {
      name: "heading-xl",
      label: "Heading XL (64/71)",
      classes: "text text-heading-xl text-black debug",
    },
    {
      name: "display-lg",
      label: "Display Large (72/86)",
      classes: "text text-display-lg text-display debug",
    },
  ];
</script>

<template>
  <section class="ui-test">
    <h2>UI Test</h2>

    <h3>Font sizes</h3>
    <div class="flex column gap-md debug">
      <p v-for="item in textUtilities" :key="item.name" :class="item.classes">
        {{ item.label }} - The climate crisis is already here.
      </p>
    </div>

    <h3>Colors</h3>
    <div class="ui-test__grid">
      <div v-for="item in colors" :key="item.name" class="ui-test__card">
        <div class="ui-test__swatch" :style="{ background: item.value }" />
        <p>{{ item.name }}</p>
        <p>{{ item.value }}</p>
      </div>
    </div>

    <h3>Framework color aliases</h3>
    <div class="ui-test__grid">
      <div
        v-for="item in frameworkColors"
        :key="item.name"
        class="ui-test__card"
      >
        <div class="ui-test__swatch" :style="{ background: item.value }" />
        <p>{{ item.name }}</p>
        <p>{{ item.value }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
  .ui-test {
    padding: $md;
    border: 1px solid $color-grey;
    margin: $md;

    &__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 10px;
    }

    &__card {
      border: 1px solid $color-grey;
      padding: 8px;
    }

    &__swatch {
      height: 48px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      margin-bottom: 6px;
    }

    &__list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    &__row {
      border: 1px solid $color-grey;
      padding: 8px;
    }
  }
</style>
