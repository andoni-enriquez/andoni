#!/usr/bin/env bun
/**
 * Sync Bun version from installed runtime to package.json.
 * Source of truth: installed bun version (bun --version)
 */

import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const PKG_PATH = "package.json";

type Target = {
  path: string;
  pattern: RegExp;
  replacement: (version: string) => string;
};

const TARGETS: Target[] = [
  {
    path: PKG_PATH,
    pattern: /"packageManager":\s*"bun@[\d.]+"/g,
    replacement: (v) => `"packageManager": "bun@${v}"`,
  },
];

function getInstalledBunVersion(): string {
  const output = execSync("bun --version", { encoding: "utf-8" });
  return output.trim();
}

function main() {
  const version = getInstalledBunVersion();
  console.log(`Syncing Bun version: ${version}`);

  let totalUpdates = 0;

  for (const target of TARGETS) {
    const content = readFileSync(target.path, "utf-8");
    const matches = content.match(target.pattern) || [];
    const updated = content.replace(
      target.pattern,
      target.replacement(version),
    );

    if (updated !== content) {
      writeFileSync(target.path, updated);
      console.log(`  ${target.path}: ${matches.length} occurrence(s) updated`);
      totalUpdates += matches.length;
    }
  }

  if (totalUpdates > 0) {
    console.log(`\nUpdated ${totalUpdates} Bun version reference(s)`);
  } else {
    console.log("All Bun versions are in sync");
  }
}

main();
