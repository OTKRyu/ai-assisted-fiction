import fs from "node:fs";

// index.md 는 작품 페이지, 나머지 .md 는 장 페이지로 그린다 (_includes/stories.njk)
export default {
  layout: "stories.njk",
  eleventyComputed: {
    // ./stories/<작품>/<파일>.md 의 <작품>
    storySlug: (data) => data.page.inputPath.split("/")[2],
    // 작품 폴더에 style.css 가 있으면 작품 페이지와 장 페이지에서 공통 스타일 다음에 불러온다
    storyStyle: (data) => {
      const slug = data.page.inputPath.split("/")[2];
      return fs.existsSync(`stories/${slug}/style.css`) ? `/stories/${slug}/style.css` : undefined;
    },
  },
};
