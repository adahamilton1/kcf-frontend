/* eslint-disable import/no-extraneous-dependencies */
// silence `'vite' should be listed in project's dependencies, not devDependencies`

import glob from "glob";
import Sitemap from "vite-plugin-sitemap";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// import path from "path" causes eslint to crash for some reason
const path = require("path");

export default defineConfig({
  appType: "mpa",
  build: {
    // include source maps if env var set to true
    sourcemap: process.env.SOURCE_MAP === "true",
    rollupOptions: {
      input: Object.fromEntries(
        glob
          .sync(path.join(__dirname, "/**/*.html"))
          .filter((htmlFilePath) => !htmlFilePath.includes("dist/"))
          .map((htmlFilePath) => {
            const baseName = path.basename(htmlFilePath);
            return [
              baseName.slice(
                0,
                baseName.length - path.extname(baseName).length
              ),
              htmlFilePath,
            ];
          })
      ),
    },
  },
  resolve: {
    alias: [
      // to allow `import a from "@/js/a"` to work in prod
      { find: "@", replacement: __dirname },
    ],
  },
  plugins: [
    Sitemap({
      hostname: "https://www.kcf.wtf",
    }),
    VitePWA({
      // default is to include all html, css, js and images in manifest,
      // so have to manually add missing images in
      includeAssets: [`/favicon.ico`, `/images/*`, "/sfx/*"],
      manifest: {
        name: "KCF Transactor",
        short_name: "KCF",
        description:
          "A simple Kadena transaction execution interface for fast feedback and experimentation",
        icons: [
          {
            src: `/images/logo/logo_512x512.png`,
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: `/images/logo/logo_192x192.png`,
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: `/images/logo/logo_192x192.png`,
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
        start_url: `/index.html`,
        display: "fullscreen",
        // hot pink
        theme_color: "#ec058e",
        background_color: "#ec058e",
      },
    }),
  ],
});
