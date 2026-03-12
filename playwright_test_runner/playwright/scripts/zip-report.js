/**
 * zip-report.js
 *
 * Zips the Playwright HTML report folder (playwright-report/) into a single
 * downloadable archive (playwright-report.zip) at the project root.
 *
 * Usage:
 *   node playwright/scripts/zip-report.js
 *   — or via npm script —
 *   npm run e2e:zip-report
 *
 * The script:
 *  1. Verifies the playwright-report/ directory exists.
 *  2. Creates a zip archive containing all report files.
 *  3. Writes the archive to playwright-report.zip in the project root.
 *  4. Logs the output path and file size for easy retrieval.
 *
 * Dependencies: archiver (devDependency)
 */

const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

// Resolve paths relative to the project root (two levels up from this script)
const PROJECT_ROOT = path.resolve(__dirname, "..", "..");
const REPORT_DIR = path.join(PROJECT_ROOT, "playwright-report");
const OUTPUT_ZIP = path.join(PROJECT_ROOT, "playwright-report.zip");

// PUBLIC_INTERFACE
/**
 * Zips the Playwright HTML report directory into a .zip archive.
 *
 * @returns {Promise<string>} Resolves with the absolute path of the created zip file.
 * @throws {Error} If the report directory does not exist or archiving fails.
 */
function zipReport() {
  return new Promise((resolve, reject) => {
    // --- Guard: ensure report directory exists ---
    if (!fs.existsSync(REPORT_DIR)) {
      const message =
        `Report directory not found: ${REPORT_DIR}\n` +
        "Run your Playwright tests first (npm run e2e) to generate the HTML report.";
      reject(new Error(message));
      return;
    }

    // --- Create write stream and archiver instance ---
    const output = fs.createWriteStream(OUTPUT_ZIP);
    const archive = archiver("zip", {
      zlib: { level: 9 }, // Maximum compression
    });

    // Listen for completion
    output.on("close", () => {
      const sizeKB = (archive.pointer() / 1024).toFixed(2);
      console.log("✅ Report zipped successfully!");
      console.log(`   File : ${OUTPUT_ZIP}`);
      console.log(`   Size : ${sizeKB} KB`);
      resolve(OUTPUT_ZIP);
    });

    // Handle warnings (e.g., stat issues on some files)
    archive.on("warning", (err) => {
      if (err.code === "ENOENT") {
        console.warn("⚠️  Archive warning (file not found, skipped):", err.message);
      } else {
        reject(err);
      }
    });

    // Handle fatal errors
    archive.on("error", (err) => {
      reject(err);
    });

    // Pipe archive data to the output file
    archive.pipe(output);

    // Append the entire playwright-report directory into the zip
    // The second argument sets the directory name inside the archive
    archive.directory(REPORT_DIR, "playwright-report");

    // Finalize the archive (no more data will be appended)
    archive.finalize();
  });
}

// --- Entry point ---
zipReport()
  .then((zipPath) => {
    console.log(`\n📦 Download your report: ${zipPath}`);
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Failed to zip report:", err.message);
    process.exit(1);
  });
