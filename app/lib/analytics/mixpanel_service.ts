import * as mixpanel from "mixpanel";

export class MixpanelAnalyticsProvider {
  mixpanelRef: mixpanel.Mixpanel | undefined;
  isTest: boolean;
  distinctIds: string[];
  functionName: string;

  constructor(
    apiKey: string,
    isTest: boolean,
    functionName: string,
    id?: string | string[] | undefined | null
  ) {
    this.isTest = isTest;
    this.mixpanelRef = isTest ? undefined : mixpanel.init(apiKey);
    this.functionName = functionName;
    this.distinctIds = [];

    if (id === undefined || id === null) {
      console.warn(
        "User id is not provided or does not exist",
        undefined,
        functionName
      );
      return;
    }

    if (Array.isArray(id)) {
      // Filter out empty strings
      this.distinctIds = id.filter(
        (userId) => typeof userId === "string" && userId !== ""
      );
      if (this.distinctIds.length === 0) {
        console.warn(
          "No valid user ids provided in array",
          undefined,
          functionName
        );
      } else {
        console.info(
          `Identify with ${this.distinctIds.length} distinct ids`,
          JSON.stringify(this.distinctIds),
          functionName
        );
      }
    } else if (typeof id === "string" && id !== "") {
      console.info("Identify with existing distinct id", id, functionName);
      this.distinctIds = [id];
    }
  }

  _trackEvent(event: string, params: mixpanel.PropertyDict) {
    // If no valid distinct IDs, just log but don't send
    if (this.distinctIds.length === 0) {
      console.log(
        `Analytics: ${event} (no users)`,
        "",
        this.functionName,
        params
      );
      return;
    }

    // Send event for each distinct ID
    for (const distinctId of this.distinctIds) {
      console.log(`Analytics: ${event}`, distinctId, this.functionName, params);

      if (!this.isTest) {
        this.mixpanelRef?.track(event, {
          distinct_id: distinctId,
          server: true,
          ...params,
        });
      }
    }
  }

  summaryPage({
    recordingId,
    userId,
    title,
    shortId,
  }: {
    recordingId: string;
    userId: string;
    title: string;
    shortId: string;
  }) {
    this._trackEvent("dev_web_summary_page_opened", {
      recordingId,
      userId,
      title,
      shortId,
    });
  }
}
