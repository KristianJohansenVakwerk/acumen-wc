import { defineCollection, defineContentConfig } from "@nuxt/content";
import { sectionsDocSchema } from "./schemaTypes/sections";

export default defineContentConfig({
  collections: {
    sections: defineCollection({
      type: "data",
      schema: sectionsDocSchema,
      // Data collection items live under `content/sections/**`
      source: "sections/**.json",
    }),
  },
});

