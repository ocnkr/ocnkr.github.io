import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("_site");
const origin = "https://ocnkr.github.io";
const errors = [];
const htmlFiles = [];
const ids = new Map();

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const name = path.join(directory, entry.name);
    if (entry.isDirectory()) await walk(name);
    else if (name.endsWith(".html")) htmlFiles.push(name);
  }
}

async function exists(name) {
  try {
    return await stat(name);
  } catch {
    return null;
  }
}

await walk(root);
for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  const observed = new Set();
  for (const match of html.matchAll(/\bid=["']([^"']+)["']/g)) {
    if (observed.has(match[1])) errors.push(`${path.relative(root, file)}: duplicate id ${match[1]}`);
    observed.add(match[1]);
  }
  ids.set(file, observed);
}

let links = 0;
for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  const relative = path.relative(root, file).split(path.sep).join("/");
  const base = new URL(`/${relative}`, origin);
  if (/<(?:main|body)\b/.test(html) && !/http-equiv=["']refresh/i.test(html)) {
    if ((html.match(/<h1\b/g) || []).length !== 1) errors.push(`${relative}: expected one h1`);
    if (/GitHub University|PhD Student at|You R\. Name|Albert Einstein|Write your biography|paper-title-number/i.test(html)) {
      errors.push(`${relative}: leftover template content`);
    }
  }
  for (const match of html.matchAll(/\b(?:href|src)=["']([^"']+)["']/g)) {
    const raw = match[1].replaceAll("&amp;", "&");
    if (/^(mailto:|tel:|data:|javascript:)/i.test(raw)) continue;
    const url = new URL(raw, base);
    if (url.origin !== origin) continue;
    links++;
    let target = path.join(root, decodeURIComponent(url.pathname));
    const info = await exists(target);
    if (info?.isDirectory()) target = path.join(target, "index.html");
    if (!(await exists(target))) {
      errors.push(`${relative}: missing local target ${raw}`);
      continue;
    }
    if (url.hash && ids.has(target) && !ids.get(target).has(decodeURIComponent(url.hash.slice(1)))) {
      errors.push(`${relative}: missing anchor ${raw}`);
    }
  }
}

for (const route of [
  "index.html",
  "research/index.html",
  "research/gpu-workload-telemetry/index.html",
  "research/code-level-performance-analysis/index.html",
  "publications/index.html",
  "software/index.html",
  "teaching/index.html",
  "service/index.html",
  "news/index.html",
  "cv/index.html",
]) {
  if (!(await exists(path.join(root, route)))) errors.push(`Missing primary page ${route}`);
}
const cv = await readFile(path.join(root, "files/OnurCankurCV.pdf"));
if (!cv.subarray(0, 5).equals(Buffer.from("%PDF-"))) errors.push("CV download is not a PDF");

if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Checked ${htmlFiles.length} HTML files and ${links} local references: no broken links, duplicate IDs, or template content.`);
}
