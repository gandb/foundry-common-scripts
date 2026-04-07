import dts from 'vite-plugin-dts';

export default {
  build: {
    lib: {
      entry: "src/module.ts",
      formats: ["iife"],
      name: "CommonScripts"
    },

    rollupOptions: {
      output: {
        extend: true
      }
    },
    minify: "terser",
    terserOptions: {
      mangle: false
    },
    target: "esnext",
    outDir: "dist/"
  },
  plugins: [dts()]
};