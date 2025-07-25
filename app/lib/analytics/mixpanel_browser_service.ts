import mixpanel, { Dict } from "mixpanel-browser";

export class MixpanelBrowserAnalyticsProvider {
  constructor(apiKey: string) {
    mixpanel.init(apiKey);
  }

  _trackEvent(event: string, params: Dict) {
    // Send event for each distinct ID
    mixpanel?.track(event, {
      ...params,
    });
  }

  ctaButton(type: CTAButtonType) {
    this._trackEvent("landing_page_CTA_clicked", { type });
  }
}

type CTAButtonType = "DownloadOnTheAppstore" | "GetStarted" | "DownloadApp";
