"use client";
import Image from "next/image";
import React from "react";
import { MixpanelBrowserAnalyticsProvider } from "../lib/analytics/mixpanel_browser_service";

const DownloadPlayStore: React.FC = () => (
  <a
    href="https://link.summaryai.app/n1497f"
    // href="https://play.google.com/store/apps/details?id=io.labhouse.audioapp"
    onClick={() => {
      if (process.env.NEXT_PUBLIC_MIXPANEL_API_KEY) {
        const mixpanelAnalyticsProvider = new MixpanelBrowserAnalyticsProvider(
          process.env.NEXT_PUBLIC_MIXPANEL_API_KEY
        );
        mixpanelAnalyticsProvider.ctaButton("DownloadOnThePlaystore");
      }
    }}
  >
    <Image
      alt="Download on the App Store"
      src="/btn-google-play.webp"
      width={150}
      height={40}
    />
  </a>
);

export default DownloadPlayStore;
