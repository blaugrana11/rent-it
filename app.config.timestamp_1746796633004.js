// app.config.ts
import { defineConfig } from "@solidjs/start/config";
var app_config_default = defineConfig({
  middleware: "src/middleware/cors.ts"
});
export {
  app_config_default as default
};
