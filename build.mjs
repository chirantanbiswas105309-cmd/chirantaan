import { cp, mkdir, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(fileURLToPath(import.meta.url));
const buildDirectory = join(projectRoot, "build");
const sourceFiles = [
  "index.html",
  "illustration.html",
  "illustration.js",
  "installation.html",
  "installation.js",
  "short-films.html",
  "short-films.js",
  "script.js",
  "style.css"
];

await rm(buildDirectory, { recursive: true, force: true });
await mkdir(buildDirectory, { recursive: true });

await Promise.all([
  ...sourceFiles.map((file) => cp(join(projectRoot, file), join(buildDirectory, file))),
  cp(join(projectRoot, "images"), join(buildDirectory, "images"), { recursive: true })
]);

console.log(`Built ${sourceFiles.length} site files and the images directory in build/.`);