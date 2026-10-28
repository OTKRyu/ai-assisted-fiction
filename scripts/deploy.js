// 로컬에서 빌드한 _site/ 를 gh-pages 브랜치로 강제 push 한다.
// GitHub Pages 설정: Source = "Deploy from a branch", 브랜치 gh-pages, 폴더 / (root)
// 사이트 주소는 https://otkryu.github.io/ai-assisted-fiction/ (eleventy.config.js 의 pathPrefix)
// 사용법: npm run deploy  (push 없이 확인만: npm run deploy -- --dry-run)
import { execFileSync } from "node:child_process";
import { rmSync, writeFileSync } from "node:fs";

const SITE = "_site";
const BRANCH = "gh-pages";
const dryRun = process.argv.includes("--dry-run");

const git = (args, cwd) =>
  execFileSync("git", args, { cwd, encoding: "utf8" }).trim();

const remote = git(["remote", "get-url", "origin"]);
const source = git(["rev-parse", "--short", "HEAD"]);
const dirty = git(["status", "--porcelain"]) !== "";

rmSync(SITE, { recursive: true, force: true });
execFileSync(process.execPath, ["node_modules/@11ty/eleventy/cmd.cjs"], {
  stdio: "inherit",
});
// Jekyll 처리를 끄지 않으면 _ 로 시작하는 파일이 배포에서 빠진다
writeFileSync(`${SITE}/.nojekyll`, "");

// 이전 배포 이력은 남기지 않고 매번 새 커밋 하나로 덮어쓴다
git(["init", "-q", "-b", BRANCH], SITE);
git(["add", "-A"], SITE);
git(
  ["commit", "-q", "-m", `Deploy ${source}${dirty ? " (uncommitted changes)" : ""}`],
  SITE
);

if (dryRun) {
  console.log(`[dry-run] ${SITE}/ 에 배포 커밋을 만들었고 push 는 하지 않았습니다.`);
} else {
  git(["push", "-f", remote, `${BRANCH}:${BRANCH}`], SITE);
  console.log(`${remote} 의 ${BRANCH} 브랜치로 배포했습니다 (source ${source}).`);
}
