import { defineConfig } from "vite";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
    root: ".",
    // All built assets are served from Django's STATIC_URL prefix (= "/static/").
    // Setting base ensures URLs Vite emits in bundled CSS/JS (e.g. @font-face src)
    // include this prefix so they resolve against Django's staticfiles handler.
    base: "/static/",
    build: {
        outDir: "dist",
        emptyOutDir: true,
        manifest: false,
        rollupOptions: {
            input: {
                main: resolve(__dirname, "frontend/src/js/main.js"),
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
