"use client";

import { useEffect, useState } from "react";

type ShareButtonProps = {
  path: string;
  title: string;
  text?: string;
};

type ShareStatus = "idle" | "shared" | "copied" | "error";

async function copyLink(url: string) {
  if (!navigator.clipboard) {
    throw new Error("Clipboard API is unavailable");
  }

  await navigator.clipboard.writeText(url);
}

export function ShareButton({ path, title, text }: ShareButtonProps) {
  const [status, setStatus] = useState<ShareStatus>("idle");

  useEffect(() => {
    if (status === "idle") {
      return;
    }

    const timeoutId = window.setTimeout(() => setStatus("idle"), 2400);
    return () => window.clearTimeout(timeoutId);
  }, [status]);

  async function handleShare() {
    const url = new URL(path, window.location.origin).toString();

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        setStatus("shared");
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
      }
    }

    try {
      await copyLink(url);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
  }

  const label = {
    idle: "공유하기",
    shared: "공유했어요",
    copied: "링크를 복사했어요",
    error: "복사하지 못했어요",
  }[status];

  return (
    <div style={{ display: "inline-grid", gap: "6px", justifyItems: "start" }}>
      <button
        type="button"
        onClick={handleShare}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "fit-content",
          maxWidth: "100%",
          minHeight: "40px",
          padding: "9px 16px",
          borderRadius: "var(--radius-pill)",
          border: "1px solid var(--color-hairline)",
          background: "rgba(255, 255, 255, 0.72)",
          color: "var(--color-ink)",
          font: "inherit",
          fontSize: "14px",
          lineHeight: 1.2,
          cursor: "pointer",
        }}
      >
        {label}
      </button>
      <span className="sr-only" aria-live="polite">
        {status === "error" ? "링크를 복사하지 못했습니다." : status === "idle" ? "" : label}
      </span>
    </div>
  );
}
