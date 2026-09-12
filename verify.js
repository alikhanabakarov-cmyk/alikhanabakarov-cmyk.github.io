const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const root = __dirname;
const problems = [];

function stripBom(value) {
  return value.replace(/^\uFEFF/, "");
}

function htmlFiles(dir = root, prefix = "") {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "dist" || entry.name === "node_modules") continue;
    const full = path.join(dir, entry.name);
    const rel = path.posix.join(prefix, entry.name);
    if (entry.isDirectory()) files.push(...htmlFiles(full, rel));
    else if (entry.name.endsWith(".html")) files.push(rel);
  }
  return files;
}

function checkSyntax() {
  for (const file of fs.readdirSync(root).filter((name) => name.endsWith(".js"))) {
    try {
      execFileSync(process.execPath, ["--check", path.join(root, file)], { stdio: "pipe" });
    } catch (error) {
      problems.push(`${file}: syntax error\n${error.stderr}`);
    }
  }
}

function checkInlineBundles() {
  const bundles = [
    { source: "public.js", marker: "gc_site_settings" },
    { source: "supabase.js", marker: "__gcSupabaseConfig" },
  ].filter(({ source }) => fs.existsSync(path.join(root, source)));

  for (const file of htmlFiles()) {
    const html = fs.readFileSync(path.join(root, file), "utf8");
    const inline = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((match) => match[1].trim());
    for (const { source, marker } of bundles) {
      const copy = inline.find((script) => script.includes(marker));
      if (!copy) continue;
      const expected = stripBom(fs.readFileSync(path.join(root, source), "utf8")).trim();
      if (copy !== expected) problems.push(`${file}: inline copy of ${source} is out of sync`);
    }
  }
}

function checkReferences() {
  const referenced = new Set();
  for (const file of htmlFiles()) {
    const html = fs.readFileSync(path.join(root, file), "utf8");
    for (const match of html.matchAll(/(?:src|href)="\/([^"?#]+)/g)) referenced.add(match[1]);
  }
  for (const target of referenced) {
    if (!fs.existsSync(path.join(root, target))) problems.push(`missing referenced file: /${target}`);
  }
}

function checkDuplicateIds() {
  for (const file of htmlFiles()) {
    const html = fs.readFileSync(path.join(root, file), "utf8");
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
    const duplicates = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
    if (duplicates.length) problems.push(`${file}: duplicate id ${duplicates.join(", ")}`);
  }
}

checkSyntax();
checkInlineBundles();
checkReferences();
checkDuplicateIds();

if (problems.length) {
  console.error(problems.map((problem) => `- ${problem}`).join("\n"));
  process.exit(1);
}
console.log("All checks passed.");