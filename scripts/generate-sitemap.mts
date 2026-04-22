import { SITEMAP_OUTPUT_PATH } from "../src/shared/seo/sitemap/config.ts";
import { writeSitemapFile } from "../src/shared/seo/sitemap/generate.ts";

function main() {
  const count = writeSitemapFile();
  console.log(`Generated ${SITEMAP_OUTPUT_PATH} with ${count} URLs.`);
}

main();
