<script setup lang="ts">
  import type { FooterMenuItem } from "../../../schemaTypes/footer";

  defineProps<{
    items: FooterMenuItem[];
  }>();
</script>

<template>
  <div class="nav flex row wrap gap-md md:gap lg:gap-md">
    <a
      v-for="item in items"
      :key="item.text"
      :href="item.url"
      target="_blank"
      class="nav__item text text-body-sm"
      >{{ item.text }}</a
    >
  </div>
</template>

<style scoped lang="scss">
  .nav {
    &__item {
      background-image: linear-gradient(90deg, currentColor, currentColor);
      background-position: bottom;
      background-repeat: no-repeat;
      background-size: 0 2px;
      padding-bottom: 0.25rem;
      transition-duration: 0.5s;
      transition-property: all;
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

      @include can-hover {
        &:hover {
          background-size: 100% 2px;
        }
      }
    }
  }
</style>
