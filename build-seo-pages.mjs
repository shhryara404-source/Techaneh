import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const BASE_URL = "https://techaneh.ir/";
const ARTICLES_FILE = path.join(ROOT, "articles.js");
const PRODUCTS_FILE = path.join(ROOT, "products.js");
const source = fs.readFileSync(ARTICLES_FILE, "utf8");
const productSource = fs.readFileSync(PRODUCTS_FILE, "utf8");
const context = {};
vm.createContext(context);
vm.runInContext(`${source}\n;globalThis.__TECHANEH_ARTICLES__ = allArticles;`, context, { filename: ARTICLES_FILE });
vm.runInContext(`${productSource}\n;globalThis.__TECHANEH_PRODUCTS__ = productsList;`, context, { filename: PRODUCTS_FILE });
const articles = Array.isArray(context.__TECHANEH_ARTICLES__) ? context.__TECHANEH_ARTICLES__ : [];
const products = Array.isArray(context.__TECHANEH_PRODUCTS__) ? context.__TECHANEH_PRODUCTS__ : [];

const esc = value => String(value ?? "").replace(/[&<>\"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const strip = value => String(value ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
const countWords = (value, lang) => lang === "fa" ? (strip(value).match(/[\u0600-\u06ff\w‌]+/g) || []).length : (strip(value).match(/\b[\w'’-]+\b/g) || []).length;
const xmlEsc = value => String(value ?? "").replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const localized = (value, lang) => value && typeof value === "object" ? (value[lang] ?? value.fa ?? value.en ?? "") : (value ?? "");
const slugify = article => {
  const title = article?.title && typeof article.title === "object" ? (article.title.en || article.title.fa || "article") : (article?.title || "article");
  return String(title).normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9\u0600-\u06ff]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 72) || "article";
};
const safeBody = html => String(html ?? "")
  .replace(/<(script|iframe|object|embed|form|link|meta)\b[\s\S]*?<\/\1>/gi, "")
  .replace(/<(script|iframe|object|embed|form|link|meta)\b[^>]*\/?>/gi, "")
  .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
  .replace(/(href|src)\s*=\s*(["'])\s*javascript:[\s\S]*?\2/gi, '$1="#"');

function prepareBody(html) {
  let index = 0;
  const toc = [];
  const body = safeBody(html).replace(/<(h[23])([^>]*)>([\s\S]*?)<\/\1>/gi, (_, tag, attrs, content) => {
    index += 1;
    const id = `section-${index}`;
    toc.push({ id, tag: tag.toLowerCase(), text: strip(content) });
    const cleanAttrs = String(attrs).replace(/\sid\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
    return `<${tag}${cleanAttrs} id="${id}">${content}</${tag}>`;
  });
  return { body, toc };
}

const ARTICLE_CSS = `
:root{color-scheme:light dark;--bg:#f4f6ff;--surface:rgba(255,255,255,.72);--solid:#fff;--text:#111528;--muted:#687089;--line:rgba(39,48,84,.13);--a:#705cff;--b:#20c7ff;--c:#ff4fa3;--shadow:0 24px 80px rgba(33,41,91,.16);--reader:780px;--size:18px;font-family:"Vazirmatn",system-ui,sans-serif}html[data-theme=dark]{--bg:#070a13;--surface:rgba(17,22,39,.72);--solid:#111627;--text:#eef1ff;--muted:#a8b0c8;--line:rgba(207,214,255,.13);--shadow:0 30px 95px rgba(0,0,0,.42)}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;color:var(--text);background:radial-gradient(circle at 15% 0,rgba(112,92,255,.18),transparent 30rem),radial-gradient(circle at 90% 15%,rgba(32,199,255,.14),transparent 28rem),var(--bg);line-height:1.9}a{color:inherit}.glass{background:var(--surface);border:1px solid rgba(255,255,255,.5);box-shadow:var(--shadow);backdrop-filter:blur(24px) saturate(150%);-webkit-backdrop-filter:blur(24px) saturate(150%)}.progress{position:fixed;inset:0 0 auto;height:4px;z-index:20;background:linear-gradient(90deg,var(--a),var(--b),var(--c));transform-origin:left;transform:scaleX(0)}.top{position:sticky;top:0;z-index:10;padding:.65rem max(1rem,calc((100vw - 1180px)/2));display:flex;align-items:center;justify-content:space-between;gap:1rem;border-bottom:1px solid var(--line);background:color-mix(in srgb,var(--bg) 76%,transparent);backdrop-filter:blur(20px)}.brand{display:flex;align-items:center;gap:.7rem;text-decoration:none;font-weight:900}.brand img{width:44px;height:44px;filter:drop-shadow(0 8px 18px rgba(112,92,255,.35))}.actions{display:flex;gap:.45rem;flex-wrap:wrap}.button{border:1px solid var(--line);background:var(--surface);color:var(--text);padding:.65rem .9rem;border-radius:999px;font:inherit;font-weight:700;cursor:pointer;text-decoration:none}.button.primary{background:linear-gradient(135deg,var(--a),var(--b));color:white;border:0}.layout{width:min(1180px,calc(100% - 2rem));margin:2rem auto 5rem;display:grid;grid-template-columns:minmax(0,1fr) 280px;gap:1.25rem;align-items:start}.article{border-radius:34px;overflow:hidden}.cover{padding:clamp(2rem,6vw,5rem);color:white;background:linear-gradient(135deg,#5f4cff,#21bff1 58%,#ff4fa3);position:relative;isolation:isolate}.cover:after{content:"";position:absolute;inset:auto -8rem -10rem auto;width:26rem;height:26rem;border:1px solid rgba(255,255,255,.32);border-radius:50%;box-shadow:0 0 0 2rem rgba(255,255,255,.05),0 0 0 5rem rgba(255,255,255,.035);z-index:-1}.eyebrow{display:inline-flex;border:1px solid rgba(255,255,255,.3);background:rgba(255,255,255,.13);padding:.3rem .75rem;border-radius:99px;font-weight:800}.cover h1{font-size:clamp(2rem,5vw,4.2rem);line-height:1.25;margin:1rem 0;max-width:18ch}.cover p{font-size:1.08rem;max-width:68ch;opacity:.9}.meta{display:flex;gap:1rem;flex-wrap:wrap;font-size:.9rem;opacity:.85}.reader-tools{display:flex;gap:.5rem;flex-wrap:wrap;padding:1rem 1.25rem;border-bottom:1px solid var(--line)}.content{width:min(var(--reader),calc(100% - 2rem));margin:0 auto;padding:2.4rem 0 4rem;font-size:var(--size)}.content h2,.content h3{scroll-margin-top:7rem;line-height:1.4}.content h2{font-size:1.7em;margin-top:2.1em}.content h3{font-size:1.3em;margin-top:1.8em}.content p{margin:1.15em 0}.content blockquote{margin:1.8rem 0;padding:1.2rem 1.4rem;border-inline-start:4px solid var(--a);background:rgba(112,92,255,.08);border-radius:18px}.content img{max-width:100%;height:auto;border-radius:20px}.content table{width:100%;border-collapse:collapse;display:block;overflow:auto}.content td,.content th{border:1px solid var(--line);padding:.75rem}.side{position:sticky;top:5.8rem;display:grid;gap:1rem}.panel{padding:1rem;border-radius:22px}.panel h2{font-size:1rem;margin:0 0 .7rem}.toc{display:grid;gap:.25rem}.toc a{text-decoration:none;color:var(--muted);padding:.35rem .55rem;border-radius:10px}.toc a:hover{color:var(--a);background:rgba(112,92,255,.08)}.sliders label{display:grid;gap:.35rem;margin-top:.7rem;color:var(--muted);font-size:.88rem}.sliders input{width:100%}.language{display:flex;gap:.45rem}.language a{flex:1;text-align:center}.footer{text-align:center;color:var(--muted);padding:2rem}.muted{color:var(--muted)}@media(max-width:900px){.layout{grid-template-columns:1fr}.side{position:static;grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:620px){.top{align-items:flex-start}.brand span{display:none}.layout{width:min(100% - 1rem,1180px);margin-top:.7rem}.article{border-radius:24px}.cover{padding:2rem 1.25rem}.side{grid-template-columns:1fr}.button{padding:.55rem .7rem;font-size:.85rem}.content{width:calc(100% - 1.5rem);font-size:17px}}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}*,*:before,*:after{animation:none!important;transition:none!important}}
`;
const ARTICLE_JS = `
(()=>{"use strict";const root=document.documentElement,progress=document.querySelector(".progress"),content=document.querySelector(".content"),theme=document.querySelector("[data-theme-toggle]"),speak=document.querySelector("[data-speak]"),share=document.querySelector("[data-share]");const saved=localStorage.getItem("techaneh:article-theme")||"system";function apply(v){root.dataset.theme=v==="system"?(matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light"):v;localStorage.setItem("techaneh:article-theme",v);theme.dataset.value=v;theme.textContent=v==="dark"?"☀":v==="light"?"◐":"◑"}apply(saved);theme?.addEventListener("click",()=>apply(theme.dataset.value==="dark"?"light":theme.dataset.value==="light"?"system":"dark"));addEventListener("scroll",()=>{const max=document.documentElement.scrollHeight-innerHeight;progress.style.transform="scaleX("+(max>0?Math.min(1,scrollY/max):0)+")"},{passive:true});speak?.addEventListener("click",()=>{if(!("speechSynthesis"in window))return;if(speechSynthesis.speaking){speechSynthesis.cancel();return}const u=new SpeechSynthesisUtterance(content.innerText);u.lang=root.lang==="fa"?"fa-IR":"en-US";u.rate=.95;speechSynthesis.speak(u)});share?.addEventListener("click",async()=>{try{if(navigator.share)await navigator.share({title:document.title,url:location.href});else await navigator.clipboard.writeText(location.href)}catch{}})})();
`;
fs.mkdirSync(path.join(ROOT, "assets"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "assets", "article-page.css"), ARTICLE_CSS.trim() + "\n");
fs.writeFileSync(path.join(ROOT, "assets", "article-page.js"), ARTICLE_JS.trim() + "\n");

for (const lang of ["fa", "en"]) {
  fs.rmSync(path.join(ROOT, lang, "articles"), { recursive: true, force: true });
}

const sitemapUrls = [BASE_URL];
const latestContentDate = articles.map(article => article.modified || article.date).filter(Boolean).sort().at(-1) || new Date().toISOString().slice(0,10);
for (const article of articles) {
  const slug = slugify(article);
  const idSlug = `${article.id}-${slug}`;
  const urls = {
    fa: new URL(`fa/articles/${idSlug}/`, BASE_URL).href,
    en: new URL(`en/articles/${idSlug}/`, BASE_URL).href
  };
  sitemapUrls.push(urls.fa, urls.en);
  for (const lang of ["fa", "en"]) {
    const dir = lang === "fa" ? "rtl" : "ltr";
    const title = localized(article.title, lang) || "Techaneh Article";
    const excerpt = localized(article.excerpt, lang) || "";
    const { body, toc } = prepareBody(localized(article.body, lang));
    const category = article.category || "Technology";
    const labels = lang === "fa" ? {
      brand:"تکانه", back:"تجربه کامل تکانه", toc:"در این مقاله", settings:"تنظیمات مطالعه", settingsHint:"اندازه متن، عرض مطالعه، سرعت و نوع صدا از تنظیمات کلی نسخه کامل تکانه کنترل می‌شوند.", listen:"شنیدن", share:"اشتراک", author:"تحریریه تکانه", lang:"English", rights:"تمامی حقوق محفوظ است."
    } : {
      brand:"Techaneh", back:"Open full Techaneh experience", toc:"In this article", settings:"Reading settings", settingsHint:"Text size, reading width, speech mode, and speed are controlled from the full site settings.", listen:"Listen", share:"Share", author:"Techaneh Editorial", lang:"فارسی", rights:"All rights reserved."
    };
    const articleUrl = urls[lang];
    const altLang = lang === "fa" ? "en" : "fa";
    const tocHtml = toc.length ? toc.map(item => `<a href="#${item.id}" style="padding-inline-start:${item.tag === "h3" ? "1rem" : ".55rem"}">${esc(item.text)}</a>`).join("") : `<span class="muted">—</span>`;
    const words = countWords(body, lang);
    const minutes = Math.max(2, Math.ceil(words / (lang === "fa" ? 170 : 210)));
    const keywords = Array.isArray(article?.keywords?.[lang]) ? article.keywords[lang] : [];
    const schema = {
      "@context":"https://schema.org", "@type":"TechArticle", headline:title, description:excerpt,
      author:{"@type":"Organization","name":article.author || labels.author,"url":BASE_URL},
      publisher:{"@type":"Organization","name":"Techaneh | تکانه","url":BASE_URL,"logo":{"@type":"ImageObject","url":`${BASE_URL}assets/techaneh-mark.svg`}},
      mainEntityOfPage:{"@type":"WebPage","@id":articleUrl}, image:article.image ? new URL(article.image, BASE_URL).href : `${BASE_URL}assets/og-cover.png`,
      inLanguage:lang === "fa" ? "fa-IR" : "en-US", articleSection:category, wordCount:words,
      timeRequired:`PT${minutes}M`, isAccessibleForFree:true, keywords:keywords.join(", "),
      citation:Array.isArray(article.sources) ? article.sources : [],
      speakable:{"@type":"SpeakableSpecification","cssSelector":["h1",".content p"]}
    };
    if (article.date) schema.datePublished = article.date;
    if (article.modified || article.date) schema.dateModified = article.modified || article.date;
    const html = `<!doctype html>
<html lang="${lang}" dir="${dir}" data-theme="light">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(title)} | ${esc(labels.brand)}</title>
<meta name="description" content="${esc(excerpt.slice(0, 200))}"><meta name="author" content="${esc(article.author || labels.author)}"><meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1">${keywords.length ? `<meta name="keywords" content="${esc(keywords.join(", "))}">` : ""}
<link rel="canonical" href="${articleUrl}"><link rel="alternate" hreflang="fa" href="${urls.fa}"><link rel="alternate" hreflang="en" href="${urls.en}"><link rel="alternate" hreflang="x-default" href="${urls.fa}">
<link rel="icon" href="../../../assets/techaneh-mark.svg" type="image/svg+xml"><link rel="manifest" href="../../../manifest.webmanifest">
<meta property="og:type" content="article">${article.date ? `<meta property="article:published_time" content="${esc(article.date)}">` : ""}${article.modified || article.date ? `<meta property="article:modified_time" content="${esc(article.modified || article.date)}">` : ""}<meta property="article:section" content="${esc(category)}"><meta property="og:site_name" content="Techaneh | تکانه"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(excerpt)}"><meta property="og:url" content="${articleUrl}"><meta property="og:image" content="${article.image ? new URL(article.image, BASE_URL).href : `${BASE_URL}assets/og-cover.png`}"><meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"><link rel="stylesheet" href="../../../assets/article-page.css">
<script type="application/ld+json">${JSON.stringify(schema).replace(/</g,"\\u003c")}</script>
</head>
<body><div class="progress"></div>
<header class="top"><a class="brand" href="../../../"><img src="../../../assets/techaneh-mark.svg" alt=""><span>${esc(labels.brand)}</span></a><div class="actions"><a class="button primary" href="../../../?article=${encodeURIComponent(article.id)}#article/${encodeURIComponent(article.id)}">${esc(labels.back)}</a><button class="button" type="button" data-theme-toggle data-value="system" aria-label="Theme">◑</button></div></header>
<main class="layout"><article class="article glass"><header class="cover"><span class="eyebrow">${esc(category)}</span><h1>${esc(title)}</h1><p>${esc(excerpt)}</p><div class="meta"><span>${esc(article.author || labels.author)}</span>${article.date ? `<time datetime="${esc(article.date)}">${esc(article.date)}</time>` : ""}</div></header><div class="reader-tools"><button class="button" type="button" data-speak>${esc(labels.listen)}</button><button class="button" type="button" data-share>${esc(labels.share)}</button></div><div class="content">${body}</div></article>
<aside class="side"><section class="panel glass"><h2>${esc(labels.toc)}</h2><nav class="toc">${tocHtml}</nav></section><section class="panel glass"><h2>${esc(labels.settings)}</h2><p class="muted">${esc(labels.settingsHint)}</p><div class="language"><a class="button" href="${urls[altLang]}">${esc(labels.lang)}</a></div></section></aside></main>
<footer class="footer">© ${new Date().getFullYear()} Techaneh. ${esc(labels.rights)}</footer><script src="../../../assets/article-page.js" defer></script></body></html>`;
    const outDir = path.join(ROOT, lang, "articles", idSlug);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, "index.html"), html);
  }
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls.map((url, i) => `  <url><loc>${xmlEsc(url)}</loc>${i === 0 ? `<lastmod>${latestContentDate}</lastmod><changefreq>daily</changefreq><priority>1.0</priority>` : `<lastmod>${latestContentDate}</lastmod><priority>0.8</priority>`}</url>`).join("\n")}\n</urlset>\n`;
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), xml);

const recent = [...articles].sort((a,b)=>String(b.modified||b.date||"").localeCompare(String(a.modified||a.date||"")) || Number(b.id)-Number(a.id)).slice(0,50);
const rssItems = recent.map(article => {
  const slug = `${article.id}-${slugify(article)}`;
  const url = new URL(`fa/articles/${slug}/`, BASE_URL).href;
  const title = localized(article.title,"fa");
  const excerpt = localized(article.excerpt,"fa");
  const pubDate = new Date(`${article.date || latestContentDate}T12:00:00Z`).toUTCString();
  return `<item><title>${xmlEsc(title)}</title><link>${xmlEsc(url)}</link><guid isPermaLink="true">${xmlEsc(url)}</guid><description>${xmlEsc(excerpt)}</description><pubDate>${pubDate}</pubDate><category>${xmlEsc(article.category || "Technology")}</category></item>`;
}).join("\n");
const rss = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>تکانه | Techaneh</title><link>${BASE_URL}</link><description>رسانه فناوری دو زبانه با تحلیل، آموزش و مقایسه هوشمند</description><language>fa-IR</language><atom:link href="${BASE_URL}feed.xml" rel="self" type="application/rss+xml"/>${rssItems}</channel></rss>\n`;
fs.writeFileSync(path.join(ROOT,"feed.xml"),rss);
const jsonFeed = {
  version:"https://jsonfeed.org/version/1.1", title:"Techaneh | تکانه", home_page_url:BASE_URL, feed_url:`${BASE_URL}feed.json`, language:"fa-IR",
  icon:`${BASE_URL}assets/icon-512.png`,
  items:recent.map(article=>{const slug=`${article.id}-${slugify(article)}`;const url=new URL(`fa/articles/${slug}/`,BASE_URL).href;return {id:url,url,title:localized(article.title,"fa"),summary:localized(article.excerpt,"fa"),content_html:safeBody(localized(article.body,"fa")),date_published:`${article.date||latestContentDate}T12:00:00Z`,image:article.image?new URL(article.image,BASE_URL).href:`${BASE_URL}assets/og-cover.png`,tags:[article.category||"Technology"]};})
};
fs.writeFileSync(path.join(ROOT,"feed.json"),JSON.stringify(jsonFeed,null,2)+"\n");

const knowledgeItems = [];
for (const article of articles) {
  const slug = `${article.id}-${slugify(article)}`;
  knowledgeItems.push({
    id: `article-${article.id}`,
    type: "article",
    category: article.category || "Technology",
    title: { fa: localized(article.title, "fa"), en: localized(article.title, "en") },
    text: {
      fa: strip(`${localized(article.excerpt, "fa")} ${localized(article.body, "fa")}`).slice(0, 7000),
      en: strip(`${localized(article.excerpt, "en")} ${localized(article.body, "en")}`).slice(0, 7000),
    },
    url: new URL(`fa/articles/${slug}/`, BASE_URL).href,
    alternateUrl: new URL(`en/articles/${slug}/`, BASE_URL).href,
    updatedAt: article.modified || article.date || null,
    sources: Array.isArray(article.sources) ? article.sources.slice(0, 12) : [],
  });
}
for (const product of products) {
  const specText = product.specs && typeof product.specs === "object"
    ? Object.entries(product.specs).map(([key, value]) => `${key}: ${value}`).join("; ")
    : "";
  knowledgeItems.push({
    id: `product-${String(product.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
    type: "product",
    category: product.category || "Product",
    name: product.name || "",
    title: { fa: product.name || "", en: product.name || "" },
    text: { fa: specText || "محصول در فهرست پایش تکانه است و مشخصات آن پس از راستی‌آزمایی منابع نمایش داده می‌شود.", en: specText || "This product is in Techaneh's monitoring catalog; specifications appear after source verification." },
    url: `${BASE_URL}#compare`,
    updatedAt: product.lastUpdated || null,
    sources: Array.isArray(product.sources) ? product.sources.slice(0, 12) : [],
    status: product.status || "seed",
  });
}
fs.mkdirSync(path.join(ROOT, "data"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "data", "knowledge.json"), JSON.stringify({
  version: 1,
  generatedAt: new Date().toISOString(),
  itemCount: knowledgeItems.length,
  items: knowledgeItems,
}, null, 2) + "\n");

const openSearch = `<?xml version="1.0" encoding="UTF-8"?>\n<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/"><ShortName>Techaneh</ShortName><Description>Search Techaneh technology articles</Description><InputEncoding>UTF-8</InputEncoding><Image height="32" width="32" type="image/png">${BASE_URL}assets/favicon-32.png</Image><Url type="text/html" template="${BASE_URL}?q={searchTerms}#articles"/></OpenSearchDescription>\n`;
fs.writeFileSync(path.join(ROOT,"opensearch.xml"),openSearch);
const llms = `# Techaneh | تکانه\n\n> Bilingual technology media with source-backed news, practical education, product comparisons, and buying guides.\n\n- Home: ${BASE_URL}\n- RSS: ${BASE_URL}feed.xml\n- JSON Feed: ${BASE_URL}feed.json\n- Sitemap: ${BASE_URL}sitemap.xml\n- Contact: mailto:shahryarvn@gmail.com\n\nArticles are available as indexable Persian and English HTML pages under /fa/articles/ and /en/articles/.\n`;
fs.writeFileSync(path.join(ROOT,"llms.txt"),llms);
console.log(`Generated ${articles.length * 2} static article pages, ${sitemapUrls.length} sitemap URLs, ${knowledgeItems.length} knowledge items, RSS, JSON Feed, OpenSearch, and llms.txt.`);
