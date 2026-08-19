const site = require("./src/_data/site.js");

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function relativeUrl(urlPath) {
  if (!urlPath) return site.baseurl + "/";
  return site.baseurl + urlPath;
}

function absoluteUrl(urlPath) {
  return site.url + relativeUrl(urlPath);
}

function truncateWords(input, numWords) {
  if (!input) return input;
  const words = String(input).split(/\s+/);
  if (words.length <= numWords) return input;
  return words.slice(0, numWords).join(" ") + "...";
}

function findBySlug(categories, slug) {
  return categories.find((c) => c.slug === slug);
}

// Sort object keys recursively, mirroring jekyll-seo-tag's sorted JSON-LD output.
function sortKeysDeep(value) {
  if (Array.isArray(value)) return value.map(sortKeysDeep);
  if (value && typeof value === "object") {
    return Object.keys(value)
      .sort()
      .reduce((acc, key) => {
        acc[key] = sortKeysDeep(value[key]);
        return acc;
      }, {});
  }
  return value;
}

const HOMEPAGE_OR_ABOUT_REGEX = /^\/(about\/)?(index\.html?)?$/;

// Faithful port of the jekyll-seo-tag output: <title>, OG/Twitter meta, and
// a sorted-keys JSON-LD <script> block, for a given page.
function renderSeo(pageTitle, pageDescription, pageUrl) {
  const siteTitle = site.title;
  const title = pageTitle && pageTitle !== siteTitle ? `${pageTitle} | ${siteTitle}` : siteTitle;
  const description = pageDescription || site.description;
  const canonicalUrl = absoluteUrl(pageUrl).replace(/\/index\.html$/, "/");
  const image = absoluteUrl(site.image);
  const isHomeOrAbout = HOMEPAGE_OR_ABOUT_REGEX.test(pageUrl);
  const jsonLdType = isHomeOrAbout ? "WebSite" : "WebPage";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": jsonLdType,
    author: { "@type": "Person", name: site.author.name },
    description,
    headline: pageTitle || siteTitle,
    image,
    publisher: {
      "@type": "Organization",
      logo: { "@type": "ImageObject", url: absoluteUrl(site.logo) },
      name: site.author.name,
    },
    url: canonicalUrl,
  };

  if (isHomeOrAbout) {
    jsonLd.name = site.social.name;
    jsonLd.sameAs = site.social.links;
  }

  return `<!-- Begin SEO tag -->
<title>${escapeHtml(title)}</title>
<meta name="generator" content="Eleventy" />
<meta property="og:title" content="${escapeHtml(pageTitle || siteTitle)}" />
<meta name="author" content="${escapeHtml(site.author.name)}" />
<meta property="og:locale" content="${site.locale}" />
<meta name="description" content="${escapeHtml(description)}" />
<meta name="twitter:description" property="og:description" content="${escapeHtml(description)}" />
<link rel="canonical" href="${canonicalUrl}" />
<meta property="og:url" content="${canonicalUrl}" />
<meta property="og:site_name" content="${escapeHtml(siteTitle)}" />
<meta property="og:image" content="${image}" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="${image}" />
<meta name="twitter:title" content="${escapeHtml(pageTitle || siteTitle)}" />
<script type="application/ld+json">
${JSON.stringify(sortKeysDeep(jsonLd))}
</script>
<!-- End SEO tag -->`;
}

function renderBreadcrumbs(name, pageUrl) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name, item: absoluteUrl(pageUrl) },
    ],
  };

  return `<nav class="breadcrumbs wrap" aria-label="Breadcrumb">
  <a href="${relativeUrl("/")}">Home</a>
  <span class="sep">/</span>
  <span>${escapeHtml(name)}</span>
</nav>
<script type="application/ld+json">
${JSON.stringify(jsonLd)}
</script>`;
}

function renderItemListJsonLd(books, name) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: books.map((book, index) => {
      const item = {
        "@type": "Book",
        name: book.title,
        author: { "@type": "Person", name: book.author },
      };
      if (book.isbn13) item.isbn = book.isbn13;
      if (book.publisher) item.publisher = { "@type": "Organization", name: book.publisher };
      if (book.year) item.datePublished = book.year;
      if (book.cover_image_url) item.image = book.cover_image_url;
      if (book.blurb) item.description = book.blurb;
      return { "@type": "ListItem", position: index + 1, item };
    }),
  };

  return `<script type="application/ld+json">
${JSON.stringify(jsonLd)}
</script>`;
}

module.exports = {
  relativeUrl,
  absoluteUrl,
  truncateWords,
  findBySlug,
  renderSeo,
  renderBreadcrumbs,
  renderItemListJsonLd,
};
