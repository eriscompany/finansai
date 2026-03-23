import fs from "node:fs";
import path from "node:path";

const required = [
  "index.html",
  "app.js",
  "src/main.js",
  "src/core/state.js",
  "src/core/storage.js",
  "src/core/events.js",
  "src/core/router.js",
  "src/modules/dashboard.js",
  "src/modules/transactions.js",
  "src/styles/tokens.css",
  "src/styles/base.css",
  "src/styles/components.css",
  "src/styles/premium-overrides.css"
];

const missing = required.filter((file) => !fs.existsSync(path.resolve(process.cwd(), file)));

if (missing.length) {
  console.error("Missing required files:");
  missing.forEach((file) => console.error(`- ${file}`));
  process.exit(1);
}

console.log("Smoke check passed.");
