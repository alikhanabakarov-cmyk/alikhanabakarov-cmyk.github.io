const fs = require("fs");
const path = require("path");

const root = __dirname;
const outDir = path.join(root, "dist");
const serverDir = path.join(outDir, "server");
const skip = new Set([
  ".git",
  ".openai",
  "dist",
  "node_modules",
  "build-sites.js",
  "verify.js",
  "package.json",
  "package-lock.json",
]);
const skipExtensions = new Set([".sql", ".md", ".zip"]);

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    if (skip.has(entry.name)) continue;
    if (skipExtensions.has(path.extname(entry.name).toLowerCase())) continue;
    if (entry.name.startsWith("preview-")) continue;

    const source = path.join(from, entry.name);
    const target = path.join(to, entry.name);
    if (entry.isDirectory()) {
      copyDir(source, target);
    } else {
      fs.copyFileSync(source, target);
    }
  }
}

function walkFiles(dir, prefix = "") {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.join(prefix, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(fullPath, relPath));
    } else {
      files.push(relPath.replace(/\\/g, "/"));
    }
  }
  return files;
}

function mimeFor(file) {
  const ext = path.extname(file).toLowerCase();
  return {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".xml": "application/xml; charset=utf-8",
    ".txt": "text/plain; charset=utf-8",
    ".webp": "image/webp",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".ico": "image/x-icon",
    ".svg": "image/svg+xml",
    ".webmanifest": "application/manifest+json; charset=utf-8",
  }[ext] || "application/octet-stream";
}

function cacheFor(file) {
  if (file.startsWith("assets/") || /\.(?:css|js|png|webp|ico|svg)$/i.test(file)) {
    return "public, max-age=31536000, immutable";
  }
  return "public, max-age=60, stale-while-revalidate=300";
}

function generateServer() {
  const files = {};
  for (const rel of walkFiles(outDir)) {
    if (rel.startsWith("server/")) continue;
    const fullPath = path.join(outDir, rel);
    files[`/${rel}`] = {
      mime: mimeFor(rel),
      cache: cacheFor(rel),
      body: fs.readFileSync(fullPath).toString("base64"),
    };
  }

  const source = `const FILES = ${JSON.stringify(files)};

function decodeBase64(value) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function resolvePath(pathname) {
  const clean = pathname.replace(/\\/+/g, "/");
  const candidates = [
    clean,
    clean.endsWith("/") ? clean + "index.html" : clean + "/index.html",
    clean.endsWith(".html") ? clean : clean + ".html",
  ];
  return candidates.find((candidate) => FILES[candidate]) || null;
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const key = resolvePath(url.pathname);
    const file = FILES[key || "/404.html"] || FILES["/index.html"];
    const headers = new Headers({
      "content-type": file.mime,
      "cache-control": file.cache,
      "x-content-type-options": "nosniff",
      "referrer-policy": "strict-origin-when-cross-origin",
      "x-frame-options": "SAMEORIGIN",
      "permissions-policy": "camera=(), microphone=(), geolocation=()",
    });
    return new Response(decodeBase64(file.body), { status: key ? 200 : 404, headers });
  },
};
`;

  fs.mkdirSync(serverDir, { recursive: true });
  fs.writeFileSync(path.join(serverDir, "package.json"), JSON.stringify({ type: "module" }, null, 2));
  fs.writeFileSync(path.join(serverDir, "index.js"), source);
}

fs.rmSync(outDir, { recursive: true, force: true });
copyDir(root, outDir);
fs.copyFileSync(path.join(root, "index.html"), path.join(outDir, "404.html"));
fs.mkdirSync(path.join(outDir, ".openai"), { recursive: true });
fs.copyFileSync(path.join(root, ".openai", "hosting.json"), path.join(outDir, ".openai", "hosting.json"));
generateServer();
console.log(`Built static site into ${outDir}`);
