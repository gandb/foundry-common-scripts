// Environment stubs for jest (registered in `setupFiles`, runs BEFORE the
// test imports). Needed only to allow IMPORTING modules that
// reference Foundry globals at load time (e.g.: npc-portrait-dialog).
// Do not declare `window` here: taulukko-commons detects the environment on load and
// a fake window breaks the injectController initialization.
(globalThis as any).foundry = (globalThis as any).foundry || {
  applications: {
    api: {
      ApplicationV2: class {},
      HandlebarsApplicationMixin: (base: any) => base,
    },
  },
};
