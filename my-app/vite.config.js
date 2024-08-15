import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";
import { qrcode } from 'vite-plugin-qrcode';
import fs from "fs";

export default defineConfig({
  server: {
    https: {
      key: fs.readFileSync("./localhost-key.pem"),
      cert: fs.readFileSync("./localhost.pem"),
      passphrase: "test",
    },
  },
  plugins: [
    react(),
    qrcode()
  ],
});
