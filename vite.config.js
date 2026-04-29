import { defineConfig } from "vite";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
    root: ".",
    build: {
        outDir: "dist",
        emptyOutDir: true,
        manifest: false,
        rollupOptions: {
            input: {
                main: resolve(__dirname, "frontend/src/js/main.js"),
                "google-analytics": resolve(__dirname, "frontend/src/js/google-analytics.js"),
                "dnt-helper": resolve(__dirname, "frontend/src/js/dnt-helper.js"),
            },
            output: {
                entryFileNames: "js/[name].js",
                chunkFileNames: "js/[name].js",
                assetFileNames: ({ name }) => {
                    if (name && name.endsWith(".css")) return "css/[name].[ext]";
                    if (name && /\.(woff2?|ttf|otf|eot|svg)$/.test(name)) return "fonts/[name].[ext]";
                    return "assets/[name].[ext]";
                },
            },
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                includePaths: ["node_modules"],
            },
        },
    },
});
