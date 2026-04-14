<script setup lang="ts">
  import { ref } from "vue";

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

  defineProps<{
    data: FooterFormData;
  }>();

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData.value),
      });

      console.log("response", response);
    } catch (error) {
      console.error("error", error);
    }
  };
</script>

<template>
  <div class="form">
    <form
      class="form__fields flex column md:row wrap gap-md"
      @submit.prevent="handleSubmit"
    >
      <input
        v-for="field in data.fields"
        :key="field.name"
        v-model="formData[field.name]"
        class="form__field"
        :type="field.type"
        :name="field.name"
        :placeholder="field.placeholder"
        :required="field.required"
      />
      <div
        class="form__submit-wrapper flex column md:row items-start justify-space-between gap-md"
      >
        <div class="form__checkbox-wrapper">
          <input
            id="checkbox"
            class="form__checkbox"
            type="checkbox"
            name="checkbox"
            required
          />
          <label class="form__checkbox-label" for="checkbox">{{
            data.checkbox.text
          }}</label>
        </div>

        <button
          type="submit"
          class="form__submit bg-white hover:bg-yellow transition-all duration-default color-black text text-bold"
        >
          Submit
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
      }
    }
  }
</style>
