import { HtmlBasePlugin } from "@11ty/eleventy";

export default function (eleventyConfig) {
  // 템플릿의 "/..." 절대 경로 앞에 pathPrefix 를 자동으로 붙여 준다
  eleventyConfig.addPlugin(HtmlBasePlugin);

  eleventyConfig.addPassthroughCopy({ public: "/" });
  eleventyConfig.addPassthroughCopy("style.css");
  // 작품 폴더 안의 삽화는 같은 경로로 복사
  eleventyConfig.addPassthroughCopy("stories/**/*.{webp,avif,png,jpg,jpeg,gif,svg}");
  // 작품별 스타일과 글꼴
  eleventyConfig.addPassthroughCopy("stories/**/*.{css,woff2}");

  for (const file of ["README.md", "AGENTS.md", "CLAUDE.md"]) {
    eleventyConfig.ignores.add(file);
  }

  // 작품 목록: stories/<작품>/index.md, 최신순
  eleventyConfig.addCollection("stories", (api) =>
    api.getFilteredByGlob("stories/*/index.md").sort((a, b) => b.date - a.date)
  );

  // 장: stories/<작품>/ 안의 index.md 가 아닌 .md, 파일명순
  eleventyConfig.addCollection("chapters", (api) =>
    api
      .getFilteredByGlob("stories/*/*.md")
      .filter((page) => !page.inputPath.endsWith("/index.md"))
      .sort((a, b) => a.inputPath.localeCompare(b.inputPath))
  );

  const storyDir = (page) => page.inputPath.split("/").slice(0, -1).join("/");

  eleventyConfig.addFilter("chaptersOf", (chapters, page) =>
    chapters.filter((chapter) => storyDir(chapter) === storyDir(page))
  );
  eleventyConfig.addFilter("indexOfPage", (pages, page) =>
    pages.findIndex((p) => p.url === page.url)
  );
  eleventyConfig.addFilter("storyOf", (stories, page) =>
    stories.find((story) => storyDir(story) === storyDir(page))
  );

  eleventyConfig.addFilter("readableDate", (date) =>
    date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    })
  );
  eleventyConfig.addFilter("isoDate", (date) => date.toISOString().slice(0, 10));

  return {
    pathPrefix: "/ai-assisted-fiction/",
    dir: { input: ".", includes: "_includes", output: "_site" },
    markdownTemplateEngine: false,
  };
}
