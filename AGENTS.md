# AGENTS.md

AI 의 보조를 받아 쓴 단편, 중편 소설과 삽화를 Eleventy 3 로 정적 HTML 로 빌드해서 GitHub Pages 로 호스팅한다.
사이트 주소: https://otkryu.github.io/ai-assisted-fiction/

## 명령어

- `npm install`: 의존성 설치 (Node 버전은 `.nvmrc`)
- `npm run dev`: 로컬 미리보기, http://localhost:8080/ai-assisted-fiction/
- `npm run build`: `_site/` 에 정적 사이트 생성
- `npm run deploy`: 빌드 후 `gh-pages` 브랜치로 강제 push (`-- --dry-run` 이면 push 생략)

## 작품 추가

작품 하나는 `stories/<작품>/` 폴더 하나다. 폴더 이름이 주소(`/stories/<작품>/`)가 되므로 공개한 뒤에는 바꾸지 않는다.

```
stories/
  first-snow/            단편: index.md 하나에 본문 전체
    index.md
    images/cover.webp
  long-night/            중편: index.md 는 소개, 장은 별도 파일
    index.md
    01.md                파일명 순서가 장 순서
    02.md
    images/...
```

`index.md` frontmatter:

```yaml
---
title: "작품 제목"
description: "한두 문장 소개. 목록과 링크 미리보기에 쓰인다"
date: "2026-10-28"
cover: "/stories/first-snow/images/cover.webp" # 선택
---
```

장 파일 frontmatter 는 `title` 만 있으면 된다. 장이 하나라도 있으면 작품 페이지에 목차가, 장 페이지에 이전/다음 링크가 생긴다.

## 본문 작성 규칙

- 제목은 레이아웃이 `title` 로 출력하므로 본문에는 `# 제목` 을 쓰지 않는다.
- 장면 전환은 `---` (가운데 `* * *` 로 표시된다).
- 삽화는 작품 폴더의 `images/` 에 두고 `/stories/<작품>/images/<파일>` 절대 경로로 넣는다. 앞에 `/ai-assisted-fiction` 은 붙이지 않는다(빌드 때 자동으로 붙는다).
- 삽화는 올리기 전에 WebP 로 변환하고 가로 1600px 이하로 줄인다. 파일 하나가 1MB 를 넘지 않게 한다.

## 구조

- `eleventy.config.js`: 컬렉션(`stories`, `chapters`), 필터, pathPrefix
- `_includes/`: 레이아웃 (`base.njk` 공통 틀, `stories.njk` 가 `story-body.njk` 작품 / `chapter-body.njk` 장을 골라 그림)
- `_data/site.json`: 사이트 이름, 소개, URL
- `stories/stories.11tydata.js`: `stories/` 아래 모든 글에 `stories.njk` 레이아웃 지정
- `index.njk`: 작품 목록, `404.md`: 404 페이지
- `style.css`: 전체 스타일 (본문은 명조, 다크 모드는 OS 설정을 따름)
- `scripts/deploy.js`: 로컬 빌드 후 `gh-pages` 브랜치로 배포

루트에 새 `.md` 파일을 두면 페이지로 빌드되므로, 페이지가 아닌 문서는 `eleventy.config.js` 의 ignores 에 추가한다.

## 배포

GitHub Actions 는 쓰지 않는다. 로컬에서 빌드한 결과물만 올린다.
저장소 Settings → Pages 의 Source 는 "Deploy from a branch", 브랜치 `gh-pages`, 폴더 `/ (root)`.
소스 변경은 `main` 에 커밋, push 하고 사이트 반영은 `npm run deploy` 로 따로 한다.

## 유지보수 원칙

- 의존성은 `@11ty/eleventy` 하나만 두고, 버전은 고정한다.
- CSS 프레임워크, 클라이언트 JS 는 추가하지 않는다.
