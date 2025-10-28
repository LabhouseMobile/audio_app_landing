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
    // If no valid distinct IDs, track with anonymous distinct_id
    if (this.distinctIds.length === 0) {
      console.log(
        `Analytics: ${event} (anonymous)`,
        "",
        this.functionName,
        params
      );

      if (!this.isTest) {
        this.mixpanelRef?.track(event, {
          server: true,
          ...params,
        });
      }
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
    status,
  }: {
    recordingId?: string;
    userId?: string;
    title?: string;
    shortId: string;
    status: string;
  }) {
    // Filter out undefined values before sending to Mixpanel
    const properties: mixpanel.PropertyDict = {
      shortId,
      status,
    };

    if (recordingId) {
      properties.recordingId = recordingId;
    }
    if (userId) {
      properties.userId = userId;
    }
    if (title) {
      properties.title = title;
    }

    this._trackEvent("dev_share_link_web_opened", properties);
  }
}
