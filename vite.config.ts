import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [ vue() ],
    server: {
        port: 34345
    },
    base: './',
    build: {
        outDir: process.env.OUTDIR || 'dist'
    }
})
