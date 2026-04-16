<script setup lang="ts">
  import { footerDocSchema } from "../../../schemaTypes/footer";
  import Nav from "../Nav/Nav.vue";

  type QueryCollectionBuilder = {
    first: () => Promise<unknown>;
  };
  declare const queryCollection: (collection: string) => QueryCollectionBuilder;

  const { data: footerContent } = await useAsyncData(() => {
    return queryCollection("footer").first();
  });

  if (!footerContent.value) {
    throw createError({
      statusCode: 404,
      statusMessage: "Footer content not found",
    });
  }

  const footerData = footerDocSchema.parse(footerContent.value as unknown);
</script>

<template>
  <footer class="footer theme theme-footer relative z-99">
    <div class="footer__top" />

    <div class="footer__body px-md md:px-lg footer-py">
      <div class="container grid-12 row-gap lg:row-gap-none gap-none">
        <div
          class="span-12 lg:span-5 giga:span-4 mb-lg md:mb-0 flex column gap-md"
        >
          <div class="flex column gap-md">
            <NuxtImg
              class="footer__logo"
              src="/_include/ui/Acumen-Logo-Bottom.svg"
              alt="Acumen Logo"
            />
            <h2 class="text text-heading-md text-bold color-white">
              {{ footerData.title }}
            </h2>
          </div>
          <p class="text text-body">{{ footerData.description }}</p>
        </div>
        <div class="none lg:block lg:span-1 giga:span-2" />
        <div class="span-12 lg:span-6 giga:span-6">
          <Form :data="footerData" />
        </div>
      </div>
    </div>

    <div class="footer__bottom px-md md:px-lg">
      <div
        class="container grid-12 gap-none md:gap row-gap-md md:row-gap-none items-center"
      >
        <a
          href="https://acumen.org"
          target="_blank"
          class="span-12 lg:span-4 justify-self-center md:justify-self-start"
          style=""
        >
          <NuxtImg
            class="footer__logo"
            src="/_include/ui/Acumen-Logo-Top.svg"
            alt="Acumen"
          />
        </a>
        <div
          class="span-12 md:span-4 lg:span-4 flex items-center justify-self-center md:justify-self-start lg:justify-self-center"
        >
          <SocialLinks :data="footerData.socialLinks ?? []" />
        </div>
        <div
          class="span-12 md:span-5 lg:span-4 justify-self-center lg:justify-self-end"
        >
          <Nav :items="footerData.footerMenu ?? []" />
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
  .footer {
    padding-bottom: 6.25rem;

    .footer-py {
      padding-top: 30px;
      padding-bottom: 60px;

      @include md-up {
        padding-top: 60px;
        padding-bottom: 80px;
      }

      @include lg-up {
        padding-top: 80px;
        padding-bottom: 100px;
      }
    }

    &__logo {
      width: 84px;
      height: auto;
      display: block;
    }
  }
</style>
