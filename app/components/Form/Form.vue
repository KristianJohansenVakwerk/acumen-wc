<script setup lang="ts">
  import { ref, useId } from "vue";

  type FormField = {
    name: string;
    type: string;
    placeholder: string;
    required?: boolean;
  };

  type FooterFormData = {
    fields: FormField[];
    checkbox: {
      text: string;
    };
  };

  const formData = ref<Record<string, string>>({});
  const submissionSuccess = ref(false);
  const checkboxId = useId();

  const props = defineProps<{
    data: FooterFormData;
    modifier?: string;
    submitText?: string;
    checkboxText?: string;
  }>();

  const modifierClass = (base: string) =>
    props.modifier ? `${base}--${props.modifier}` : null;

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData.value),
      });
      const data = (await response.json().catch(() => ({}))) as {
        success?: boolean;
      };
      if (response.ok && data.success === true) {
        submissionSuccess.value = true;
      }
    } catch (error) {
      console.error("error", error);
    }
  };
</script>

<template>
  <div class="form" :class="modifierClass('form')">
    <div
      v-if="submissionSuccess"
      class="form__success text text-heading text-bold"
      :class="modifierClass('form__success')"
    >
      Thank you for signing up! <br /><br />Be on the lookout for the latest
      news and updates from Acumen.
    </div>
    <form
      v-else
      class="form__fields flex column md:row wrap gap-md"
      :class="modifierClass('form__fields')"
      @submit.prevent="handleSubmit"
    >
      <input
        v-for="field in data.fields"
        :key="field.name"
        v-model="formData[field.name]"
        class="form__field"
        :class="modifierClass('form__field')"
        :type="field.type"
        :name="field.name"
        :placeholder="`${field.required ? field.placeholder + '*' : field.placeholder}`"
        :required="field.required"
      />
      <div
        class="form__submit-wrapper flex column md:row items-start justify-space-between gap-md"
        :class="modifierClass('form__submit-wrapper')"
      >
        <div
          class="form__checkbox-wrapper"
          :class="modifierClass('form__checkbox-wrapper')"
        >
          <input
            :id="checkboxId"
            class="form__checkbox"
            :class="modifierClass('form__checkbox')"
            type="checkbox"
            name="checkbox"
            required
          />
          <label
            class="form__checkbox-label"
            :class="modifierClass('form__checkbox-label')"
            :for="checkboxId"
            v-html="props.checkboxText ?? data.checkbox.text"
          ></label>
        </div>

        <button
          type="submit"
          class="form__submit bg-white hover:bg-yellow transition-all duration-default color-black text text-bold"
          :class="modifierClass('form__submit')"
        >
          {{ props.submitText ?? "Submit" }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped lang="scss">
  .form {
    .form__fields {
      .form__field {
        border: 1px solid $color-white-tint-light;
        color: #fff;
        background-color: transparent;
        padding: 20px;
        flex: 1 0 auto;
        transition: border 0.3s ease;
        border-radius: 8px;
        font-size: 16px;
        font-family: $base-font-family-semi-bold;

        &::placeholder {
          color: $color-white-tint-medium;
        }

        &:focus {
          color: $color-white;
          background-color: transparent;
          border: 1px solid $color-white-tint-focus;
        }

        &:-webkit-autofill,
        &:-webkit-autofill:hover,
        &:-webkit-autofill:focus,
        &:-webkit-autofill:active,
        &:-internal-autofill-selected {
          -webkit-text-fill-color: $color-white !important;
          -webkit-box-shadow: 0 0 0 1000px transparent inset !important;
          box-shadow: 0 0 0 1000px transparent inset !important;
          background-color: transparent !important;
          transition: background-color 5000s ease-in-out 0s;
          border: 1px solid $color-white-tint-focus;
        }

        &:last-of-type {
          flex: 0 0 100%;
        }
      }

      &--accordion {
        .form__field {
          padding: 10px;
          border: 1px solid $color-white;

          &::placeholder {
            color: $color-white;
          }
        }

        .form__submit {
          min-width: 200px;
          margin: 0 auto;
          font-family: $base-font-family-black;
          font-size: 24px;
        }
      }
    }

    .form__submit-wrapper {
      flex: 0 0 100%;

      .form__checkbox-wrapper {
        flex: 0 0 100%;

        @include md-up {
          flex: 0 0 50%;
        }

        @include lg-up {
          flex: 0 0 66.66%;
        }

        .form__checkbox {
          float: left;
          width: 16px;
          height: 16px;
          border-radius: 3px;
          background-color: transparent;
          box-shadow: transparent 0 0 0;
          border: 1px solid $color-white-tint-light;
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          padding: 0;
          margin: 0;

          &:checked {
            background-color: $color-white;
            color: $color-black;
            position: relative;

            &:after {
              content: "";
              position: absolute;
              left: 4px;
              top: 1px;
              width: 6px;
              height: 10px;
              border: solid black;
              border-width: 0 2px 2px 0;
              transform: rotate(45deg);
            }
          }
        }

        .form__checkbox-label {
          font-size: 12px;
          font-family: $base-font-family;
          color: $color-white;
          cursor: pointer;
          display: block;
          padding-left: $md;

          & > a {
            text-decoration: underline;
            color: $color-white;
          }

          @include lg-up {
            padding-left: $lg;
          }
        }
      }

      .form__submit {
        flex: 0 0 auto;
        min-height: 42px;
        padding: 9px 22px 10px;
        border-radius: 50px;
        // max-width: 200px;
        // margin: 0 auto;
      }
    }
  }
</style>
