import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const privacyPageUrl = new URL("../app/privacy/page.tsx", import.meta.url);

test("개인정보처리방침은 설계도 저장과 분석 범위를 구체적으로 안내한다", async () => {
  const source = await readFile(privacyPageUrl, "utf8");

  assert.match(source, /로컬 저장소\(localStorage\)/);
  assert.match(source, /서버로 전송하지 않고/);
  assert.match(source, /입력 전체 삭제/);
  assert.match(source, /추천 결과 개수/);
  assert.match(source, /성적, 소득, 가족, 주거, 대출 조건 자체/);
  assert.match(source, /분석 이벤트에 포함하지 않습니다/);
});
