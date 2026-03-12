const fs = require("fs");
const path = require("path");

/**
 * Loads a JSON file from playwright/test-data and returns the parsed object.
 * Throws a clear error if missing/invalid.
 *
 * @param {string} filename
 * @returns {any}
 */
function loadJson(filename) {
  const fullPath = path.join(__dirname, "..", "test-data", filename);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Test data file not found: ${fullPath}`);
  }
  const raw = fs.readFileSync(fullPath, "utf-8");
  try {
    return JSON.parse(raw);
  } catch (e) {
    throw new Error(`Invalid JSON in ${fullPath}: ${e.message}`);
  }
}

// PUBLIC_INTERFACE
function getLoginData() {
  /** Returns login test data for valid/invalid cases. */
  const data = loadJson("login.users.json");

  if (!data || typeof data !== "object") {
    throw new Error("login.users.json must export an object");
  }
  if (!data.valid || !data.invalid) {
    throw new Error("login.users.json must include 'valid' and 'invalid' sections");
  }
  return data;
}

module.exports = { getLoginData };
