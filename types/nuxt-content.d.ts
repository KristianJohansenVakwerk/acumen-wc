// Minimal typing shims for Nuxt Content query helpers.
// These are only to keep the IDE/linter happy.
declare const queryContent: (collection: string) => {
  findOne: () => Promise<unknown>;
};

declare const queryCollection: (collection: string) => {
  first: () => Promise<unknown>;
};

