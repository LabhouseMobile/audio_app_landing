"use client";

import { ReactNode } from "react";
import { MixpanelBrowserAnalyticsProvider } from "../lib/analytics/mixpanel_browser_service";
import { Button } from "./button";

interface BiPanelProps {
  /**
   * Content for the left column
   */
  leftColumn: ReactNode;
  /**
   * Content for the right column
   */
  rightColumn: ReactNode;
  /**
   * Accent color for the panel (used for the right column by default)
   * @default "#6982F9"
   */
  accentColor?: string;
  /**
   * Whether to invert the column order on md screens
   * @default false
   */
  inverted?: boolean;
  /**
   * CSS class to apply to the container
   */
  className?: string;
}

export default function BiPanel({
  leftColumn,
  rightColumn,
  accentColor = "#6982F9",
  inverted = false,
  className = "",
}: BiPanelProps) {
  // Fixed background color that was common in all instances
  const baseColor = "#F5FAFF";

  const leftBg = baseColor;
  const rightBg = accentColor;

  return (
    <div
      className={`flex flex-col ${
        inverted ? "md:flex-row-reverse" : "md:flex-row"
      } max-w-6xl self-center ${className} mx-8 rounded-[5rem] shadow-lg`}
      style={{ boxShadow: `0 10px 15px -3px ${rightBg}20` }}
    >
      <div
        className={`w-full md:w-1/2 p-16 flex flex-col gap-8 items-start justify-center 
          rounded-t-[5rem] 
          ${
            inverted
              ? "md:rounded-r-[5rem] md:rounded-tl-none"
              : "md:rounded-l-[5rem] md:rounded-tr-none "
          }`}
        style={{ backgroundColor: leftBg }}
      >
        {leftColumn}
        <Button
          color="blue"
          href="#download"
          className="w-1/2"
          onClick={() => {
            if (process.env.NEXT_PUBLIC_MIXPANEL_API_KEY) {
              const mixpanelAnalyticsProvider =
                new MixpanelBrowserAnalyticsProvider(
                  process.env.NEXT_PUBLIC_MIXPANEL_API_KEY
                );
              mixpanelAnalyticsProvider.ctaButton("GetStarted");
            }
          }}
        >
          Get Started
        </Button>
      </div>
      <div
        className={`w-full md:w-1/2 p-16 flex flex-col gap-8 items-center justify-center 
          rounded-b-[5rem] 
          ${
            inverted
              ? "md:rounded-l-[5rem] md:rounded-br-none"
              : "md:rounded-r-[5rem] md:rounded-bl-none"
          }`}
        style={{ backgroundColor: rightBg }}
      >
        {rightColumn}
      </div>
    </div>
  );
}
