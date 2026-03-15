#!/usr/bin/env bun
/**
 * Update Bun workspace catalog dependencies to latest versions.
 * Workaround for https://github.com/oven-sh/bun/issues/21236
 */

import { readFileSync, writeFileSync } from "node:fs";

const PKG_PATH = "package.json";
const CONCURRENCY = 5;

type Catalog = Record<string, string>;

/** Run async tasks with limited concurrency */
async function mapWithLimit<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = [];
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const i = index++;
      results[i] = await fn(items[i]!);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, worker),
  );
  return results;
}

type NpmPackageData = {
  "dist-tags": Record<string, string>;
  versions: Record<string, unknown>;
};

/** Parse version string into comparable parts */
function parseVersion(version: string): {
  major: number;
  minor: number;
  patch: number;
  prerelease: string | null;
  prereleaseNum: number;
} {
  const clean = version.replace(/^[\^~>=<]+/, "");
  const [main, prerelease] = clean.split("-");
  const [major = 0, minor = 0, patch = 0] = (main ?? "").split(".").map(Number);

  let prereleaseNum = 0;
  if (prerelease) {
    const match = prerelease.match(/(\d+)$/);
    if (match) prereleaseNum = Number(match[1]);
  }

  return {
    major: major ?? 0,
    minor: minor ?? 0,
    patch: patch ?? 0,
    prerelease: prerelease ?? null,
    prereleaseNum,
  };
}

/** Compare two versions. Returns positive if a > b, negative if a < b, 0 if equal */
function compareVersions(a: string, b: string): number {
  const va = parseVersion(a);
  const vb = parseVersion(b);

  // Compare major.minor.patch
  if (va.major !== vb.major) return va.major - vb.major;
  if (va.minor !== vb.minor) return va.minor - vb.minor;
  if (va.patch !== vb.patch) return va.patch - vb.patch;

  // Stable > prerelease for same version
  if (!va.prerelease && vb.prerelease) return 1;
  if (va.prerelease && !vb.prerelease) return -1;

  // Compare prerelease tags alphabetically, then by number
  if (va.prerelease && vb.prerelease) {
    const tagA = va.prerelease.replace(/\d+$/, "");
    const tagB = vb.prerelease.replace(/\d+$/, "");
    if (tagA !== tagB) return tagA.localeCompare(tagB);
    return va.prereleaseNum - vb.prereleaseNum;
  }

  return 0;
}

async function getLatestVersion(
  pkg: string,
  currentVersion: string,
): Promise<string | null> {
  try {
    const res = await fetch(
      `https://registry.npmjs.org/${encodeURIComponent(pkg)}`,
    );
    if (!res.ok) return null;

    const data = (await res.json()) as NpmPackageData;
    const currentParsed = parseVersion(currentVersion);
    const isCurrentPrerelease = currentParsed.prerelease !== null;

    // Get latest stable
    const latestStable = data["dist-tags"]?.latest;

    // If current is stable, just return latest stable
    if (!isCurrentPrerelease) {
      return latestStable ?? null;
    }

    // Current is prerelease - find the best update
    const allVersions = Object.keys(data.versions ?? {});

    // Find latest prerelease in the same major version line
    let latestPrerelease: string | null = null;
    for (const v of allVersions) {
      const parsed = parseVersion(v);
      if (parsed.prerelease && parsed.major === currentParsed.major) {
        if (!latestPrerelease || compareVersions(v, latestPrerelease) > 0) {
          latestPrerelease = v;
        }
      }
    }

    // Compare: use stable if it's greater than both current and latest prerelease
    if (latestStable && compareVersions(latestStable, currentVersion) > 0) {
      if (
        !latestPrerelease ||
        compareVersions(latestStable, latestPrerelease) >= 0
      ) {
        return latestStable;
      }
    }

    // Otherwise use latest prerelease if it's newer
    if (
      latestPrerelease &&
      compareVersions(latestPrerelease, currentVersion) > 0
    ) {
      return latestPrerelease;
    }

    return null;
  } catch {
    return null;
  }
}

function preservePrefix(current: string, latest: string): string {
  const match = current.match(/^(\^|~|>=|>|<|<=)?/);
  const prefix = match?.[1] ?? "^";
  return `${prefix}${latest}`;
}

async function updateCatalog(
  name: string,
  catalog: Catalog,
): Promise<{ updated: number; changes: string[] }> {
  const entries = Object.entries(catalog);
  const updates = await mapWithLimit(
    entries,
    CONCURRENCY,
    async ([pkg, currentVersion]) => {
      const latest = await getLatestVersion(pkg, currentVersion);
      if (!latest) return null;

      const newVersion = preservePrefix(currentVersion, latest);
      if (newVersion === currentVersion) return null;

      return { pkg, currentVersion, newVersion };
    },
  );

  const changes: string[] = [];
  for (const update of updates) {
    if (update) {
      catalog[update.pkg] = update.newVersion;
      changes.push(
        `  ${update.pkg}: ${update.currentVersion} → ${update.newVersion}`,
      );
    }
  }

  if (changes.length > 0) {
    console.log(`\n${name}:`);
    for (const c of changes) console.log(c);
  }

  return { updated: changes.length, changes };
}

async function main() {
  const pkg = JSON.parse(readFileSync(PKG_PATH, "utf-8"));
  const workspaces = pkg.workspaces ?? {};

  let totalUpdated = 0;

  // Update default catalog
  if (workspaces.catalog) {
    const result = await updateCatalog("catalog", workspaces.catalog);
    totalUpdated += result.updated;
  }

  // Update named catalogs
  if (workspaces.catalogs) {
    for (const [name, catalog] of Object.entries(workspaces.catalogs)) {
      const result = await updateCatalog(
        `catalogs.${name}`,
        catalog as Catalog,
      );
      totalUpdated += result.updated;
    }
  }

  if (totalUpdated > 0) {
    writeFileSync(PKG_PATH, `${JSON.stringify(pkg, null, 2)}\n`);
    console.log(`\nUpdated ${totalUpdated} catalog dependencies`);
  } else {
    console.log("All catalog dependencies are up to date");
  }
}

main();
