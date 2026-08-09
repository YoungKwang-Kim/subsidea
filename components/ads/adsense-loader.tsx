"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { isMonetizablePath } from "@/lib/ads/monetization-policy-core.mjs";

const adsenseClientId = "ca-pub-5611050582366517";
const interactionEvents = ["pointerdown", "touchstart", "keydown"] as const;

function removeAdSenseElements() {
  document.querySelectorAll("script[data-subsidea-adsense], ins.adsbygoogle").forEach((element) => element.remove());
}

export function AdSenseLoader() {
  const pathname = usePathname();

  useEffect(() => {
    if (!isMonetizablePath(pathname)) {
      removeAdSenseElements();
      return;
    }

    let timeoutId: number | undefined;

    const loadAdSense = () => {
      if (document.querySelector("script[data-subsidea-adsense]")) {
        return;
      }

      const script = document.createElement("script");
      script.async = true;
      script.crossOrigin = "anonymous";
      script.dataset.subsideaAdsense = "true";
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`;
      document.head.appendChild(script);
    };

    const scheduleLoad = () => {
      timeoutId = window.setTimeout(loadAdSense, 12000);
    };

    if (document.readyState === "complete") {
      scheduleLoad();
    } else {
      window.addEventListener("load", scheduleLoad, { once: true });
    }

    interactionEvents.forEach((eventName) => {
      window.addEventListener(eventName, loadAdSense, { once: true, passive: true });
    });

    return () => {
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
      window.removeEventListener("load", scheduleLoad);
      interactionEvents.forEach((eventName) => window.removeEventListener(eventName, loadAdSense));
      removeAdSenseElements();
    };
  }, [pathname]);

  return null;
}
