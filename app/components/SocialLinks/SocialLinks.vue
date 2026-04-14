<script setup lang="ts">
  import type { FooterSocialLink } from "../../../schemaTypes/footer";
  const props = defineProps<{
    data: FooterSocialLink[];
  }>();

  function isInlineSvg(icon?: string) {
    return typeof icon === "string" && icon.trim().startsWith("<svg");
  }
</script>

<template>
  <ul class="social-links flex row justify-start">
    <li v-for="social in props.data" :key="social.platform">
      <a
        class="social-links__item"
        :href="social.url"
        target="_blank"
        rel="noopener noreferrer"
        :title="social.platform"
      >
        <!-- eslint-disable-next-line vue/no-v-html -->
        <span v-if="isInlineSvg(social.icon)" v-html="social.icon" />
      </a>
    </li>
  </ul>
</template>

<style lang="scss">
  .social-links {
    gap: 0.5rem;
    &__item {
      border-radius: 50%;
      background-color: $color-yellow;
      width: 30px;
      height: 30px;
      transition: background-color 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 0;

      span {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      svg {
        display: block;
        width: 100%;
        height: auto;
      }

      @include can-hover {
        background-color: transparent;
      }

      @include lg-up {
        width: 28px;
        height: 28px;
      }

      @include can-hover {
        &:hover {
          background-color: $color-yellow;
          color: $color-blue;
        }
      }
    }
  }
</style>
