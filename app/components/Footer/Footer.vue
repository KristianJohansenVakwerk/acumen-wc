<script setup lang="ts">
  const footerData = {
    title: "Stand with the Champions.",
    description:
      "Join a growing community supporting climate resilience. Get stories, insights, and opportunities to stay involved. Love the World Game, love the world more.",
    fields: [
      {
        name: "firstname",
        type: "text",
        placeholder: "First name",
        required: true,
      },
      {
        name: "lastname",
        type: "text",
        placeholder: "Last name",
        required: true,
      },
      {
        name: "email",
        type: "email",
        placeholder: "Email address",
        required: true,
      },
    ],
    checkbox: {
      text: "I agree to receive updates and communications.",
    },
  };
</script>

<template>
  <footer class="footer theme theme-footer relative z-99">
    <div class="footer__top" />

    <div
      class="footer__body px-md md:px-lg footer-py border-1 border-white-tint-light"
    >
      <div class="container grid-12 row-gap-lg lg:row-gap-none gap-none">
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
        class="container grid-12 gap-none md:gap row-gap-md md:row-gap-none items-end"
      >
        <div class="span-12 md:span-6 lg:span-4">
          <NuxtImg
            class="footer__logo"
            src="/_include/ui/Acumen-Logo-Top.svg"
            alt="Acumen"
          />
        </div>
        <div
          class="span-12 md:span-6 lg:span-8 justify-self-start lg:justify-self-end"
        >
          <nav>
            <ul class="flex row gap-md">
              <li>
                <NuxtLink
                  href="https://www.acumen.org"
                  target="_blank"
                  class="text text-body-sm"
                  >Privacy Policy</NuxtLink
                >
              </li>
              <li>
                <NuxtLink
                  href="https://www.acumen.org"
                  target="_blank"
                  class="text text-body-sm"
                  >Terms of Use</NuxtLink
                >
              </li>
              <li>
                <NuxtLink
                  href="https://www.acumen.org"
                  target="_blank"
                  class="text text-body-sm"
                  >Site Credits</NuxtLink
                >
              </li>
            </ul>
          </nav>
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
