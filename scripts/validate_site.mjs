import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const filePath = (file) => path.join(root, file);
const read = (file) => fs.readFileSync(filePath(file), "utf8");
const fail = (message) => { console.error(`Validation failed: ${message}`); process.exit(1); };

const requiredFiles = [
  "index.html", "articles.js", "products.js", "config.js", "favicon.svg",
  "manifest.webmanifest", "sw.js", "robots.txt", "sitemap.xml",
  "assets/og-cover.png", "assets/icon-192.png", "assets/icon-512.png",
  "assets/site.css", "assets/app.js", "assets/v5-preflight.js", "assets/v5.css",
  "assets/v5.js", "assets/v6.css", "assets/v6.js", "feed.xml", "feed.json",
  "opensearch.xml", "llms.txt", "data/knowledge.json"
];
for (const file of requiredFiles) {
  if (!fs.existsSync(filePath(file)) || fs.statSync(filePath(file)).size === 0) fail(`missing or empty ${file}`);
}

const index = read("index.html");
const ids = [...index.matchAll(/\sid=["']([^"']+)["']/g)].map((m) => m[1]);
const duplicates = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
if (duplicates.length) fail(`duplicate HTML ids: ${duplicates.join(", ")}`);

const inlineScripts = [...index.matchAll(/<script(?![^>]*\bsrc=)(?![^>]*type=["']application\/ld\+json["'])[^>]*>([\s\S]*?)<\/script>/gi)]
  .map((match) => match[1].trim())
  .filter(Boolean);
for (const [i, script] of inlineScripts.entries()) {
  try { new vm.Script(script, { filename: `index-inline-${i + 1}.js` }); }
  catch (error) { fail(error.message); }
}

const classicScripts = [
  "config.js", "articles.js", "products.js", "sw.js", "assets/article-page.js",
  "assets/app.js", "assets/v5-preflight.js", "assets/v5.js", "assets/v6.js"
];
for (const file of classicScripts) {
  try { new vm.Script(read(file), { filename: file }); }
  catch (error) { fail(error.message); }
}

let knowledge;
try { knowledge = JSON.parse(read("data/knowledge.json")); }
catch (error) { fail(`invalid data/knowledge.json: ${error.message}`); }
const knowledgeItems = Array.isArray(knowledge) ? knowledge : knowledge?.items;
if (!Array.isArray(knowledgeItems)) fail("knowledge catalog must contain an items array");
if (knowledge.itemCount !== undefined && knowledge.itemCount !== knowledgeItems.length) fail("knowledge itemCount does not match items length");
const articleCount = knowledgeItems.filter((item) => item.type === "article").length;
const productCount = knowledgeItems.filter((item) => item.type === "product").length;
if (articleCount < 1 || productCount < 1) fail(`knowledge catalog incomplete: ${articleCount} articles, ${productCount} products`);

const sitemap = read("sitemap.xml");
if (!sitemap.includes("<urlset") || !sitemap.includes("https://techaneh.ir/")) fail("sitemap is missing the canonical project URL");
if (!read("robots.txt").includes("Sitemap:")) fail("robots.txt has no Sitemap directive");
if (!index.includes("shahryarvn@gmail.com")) fail("contact email is missing");
if (!index.includes('id="particleField"')) fail("particle canvas is missing");
if (!index.includes('id="productDataStatus"')) fail("product catalog status is missing");
if (!index.includes("assets/v6.css") || !index.includes("assets/v6.js")) fail("v6 interface assets are not linked");
if (!index.includes("https://techaneh.ir/")) fail("canonical production domain is missing from index");

console.log(`Site validation passed: ${ids.length} ids, ${inlineScripts.length} inline script block(s), ${articleCount} articles and ${productCount} products in knowledge.`);
