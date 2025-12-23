// vite.config.ts (esboço)
export default {
  build: {
    lib: {
      entry: "src/module.ts",
      formats: ["iife"],
      name: "MyModule" // expõe algo global se quiser
    },
    outDir: "dist/"
  }
};
