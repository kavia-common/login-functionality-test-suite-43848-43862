const { spawnSync } = require("child_process");

const baseURL = process.env.E2E_BASE_URL || "https://the-internet.herokuapp.com";
const url = `${baseURL.replace(/\/+$/, "")}/login`;

// Run: npx playwright codegen <url>
const result = spawnSync(
  process.platform === "win32" ? "npx.cmd" : "npx",
  ["playwright", "codegen", url],
  { stdio: "inherit" }
);

process.exit(result.status ?? 1);
