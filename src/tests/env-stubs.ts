// Stubs de ambiente para o jest (registrado em `setupFiles`, roda ANTES dos
// imports dos testes). Necessario apenas para permitir IMPORTAR modulos que
// referenciam globais do Foundry em tempo de carga (ex.: npc-portrait-dialog).
// Nao declare `window` aqui: o taulukko-commons detecta ambiente na carga e
// um window falso quebra a inicializacao do injectController.
(globalThis as any).foundry = (globalThis as any).foundry || {
  applications: {
    api: {
      ApplicationV2: class {},
      HandlebarsApplicationMixin: (base: any) => base,
    },
  },
};
