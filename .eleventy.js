const yaml = require("js-yaml");
const helpers = require("./eleventy-helpers.js");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  eleventyConfig.addDataExtension("yml,yaml", (contents) => yaml.load(contents));

  eleventyConfig.addFilter("relative_url", helpers.relativeUrl);
  eleventyConfig.addFilter("absolute_url", helpers.absoluteUrl);
  eleventyConfig.addFilter("truncatewords", helpers.truncateWords);
  eleventyConfig.addFilter("findBySlug", helpers.findBySlug);
  eleventyConfig.addFilter("limit", (arr, n) => arr.slice(0, n));
  eleventyConfig.addFilter("dateFormat", (date, format) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];
    const monthsShort = months.map((m) => m.slice(0, 3));
    const d = new Date(date);
    if (format === "%B %Y") return `${months[d.getMonth()]} ${d.getFullYear()}`;
    if (format === "%b %Y") return `${monthsShort[d.getMonth()]} ${d.getFullYear()}`;
    return d.toISOString();
  });

  eleventyConfig.addShortcode("seo", helpers.renderSeo);
  eleventyConfig.addShortcode("breadcrumbs", helpers.renderBreadcrumbs);
  eleventyConfig.addShortcode("itemListJsonLd", helpers.renderItemListJsonLd);

  return {
    dir: {
      input: "src",
      output: "docs",
      includes: "_includes",
      data: "_data",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
