import { z } from "zod";

/**
 * Flexible "sections" model for a simple one-pager.
 *
 * For now we only require `props.title`.
 * Later, you can either:
 * - add more required props, or
 * - keep `props` flexible per `type`.
 */
const richTextBlocksSchema = z.array(
  z.object({
    tag: z.enum(["h3", "p"]),
    text: z.string(),
  })
);

export const championItemSchema = z.object({
  focusLabel: z.string().optional(),
  name: z.string(),
  image: z.string().optional(),
  bg: z.string(),
  imageBg: z.string(),
  role: z.string().optional(),
  country: z.string().optional(),
  company: z.string().optional(),
  blurb: z.string(),
  ctaText: z.string(),
  ctaLink: z.string(),
});

export const sectionPropsSchema = z
  .object({
    title: z.string(),
    // Hero
    subhead: z.string().optional(),
    richtext: richTextBlocksSchema.optional(),
    videoSrc: z.string().optional(),

    // Donation
    tiersIntro: z.string().optional(),
    tiers: z
      .array(
        z.object({
          amount: z.number(),
          title: z.string(),
          copy: z.string(),
          ctaText: z.string(),
        })
      )
      .optional(),

    // Champions
    alt: z.string().optional(),
    items: z.array(championItemSchema).optional(),

    // Footer
    copy: z.array(z.string()).optional(),
    ctaText: z.string().optional(),
    legalDisclaimerLabel: z.string().optional(),
    legalDisclaimer: z.string().optional(),
  })
  .passthrough();

export const sectionItemSchema = z
  .object({
    id: z.string(),
    type: z.string(),
    props: sectionPropsSchema,
  })
  .passthrough();

export const sectionsDocSchema = z
  .object({
    sections: z.array(sectionItemSchema),
  })
  .passthrough();

export type SectionProps = z.infer<typeof sectionPropsSchema>;
export type SectionItem = z.infer<typeof sectionItemSchema>;
export type SectionsDoc = z.infer<typeof sectionsDocSchema>;
export type ChampionItem = z.infer<typeof championItemSchema>;
