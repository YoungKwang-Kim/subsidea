import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const layoutUrl = new URL("../app/layout.tsx", import.meta.url);
const adsenseLoaderUrl = new URL("../components/ads/adsense-loader.tsx", import.meta.url);
const globalStylesUrl = new URL("../app/globals.css", import.meta.url);

test("AdSense는 소유권 표식을 유지하면서 첫 화면 이후에 로드한다", async () => {
  const source = await readFile(layoutUrl, "utf8");
  const loaderSource = await readFile(adsenseLoaderUrl, "utf8");

  assert.match(source, /google-adsense-account/);
  assert.match(source, /<AdSenseLoader \/>/);
  assert.match(loaderSource, /setTimeout\(loadAdSense, 12000\)/);
  assert.match(loaderSource, /isMonetizablePath\(pathname\)/);
  assert.equal(source.includes("<script\n          async\n          src=\"https://pagead2"), false);
});

test("하단 섹션에 CLS를 유발할 수 있는 임시 높이를 사용하지 않는다", async () => {
  const source = await readFile(globalStylesUrl, "utf8");

  assert.equal(source.includes("contain-intrinsic-size"), false);
  assert.equal(source.includes("content-visibility: auto"), false);
});

test("초기 렌더링 중 푸터가 첫 화면으로 이동하지 않도록 메인 높이를 예약한다", async () => {
  const source = await readFile(globalStylesUrl, "utf8");

  assert.match(source, /\.page-shell > main\s*\{[^}]*min-height: calc\(100vh - var\(--nav-height\)\)/s);
});
