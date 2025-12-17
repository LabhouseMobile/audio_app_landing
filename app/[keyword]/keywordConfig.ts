export type ComponentConfig = {
  [key: string]:
    | string
    | number
    | boolean
    | Array<string | Record<string, unknown>>
    | Record<string, unknown>;
};

export type KeywordConfig = {
  [component: string]: ComponentConfig;
};

const keywordConfigs: { [keyword: string]: KeywordConfig } = {
  "ai-meeting-assistant": {
    Hero: {
      title: "AI Meeting Assistant",
      subtitle:
        "Get perfect notes after every meeting. Summary AI records, transcribes, and delivers concise summaries straight to your inbox.",
    },
    BeforeAfter: {
      before: "Hours spent taking notes and writing meeting summaries",
      after: "Perfect meeting notes delivered automatically in seconds",
    },
    CTA: {
      title: "Never Take Meeting Notes Manually Again",
      buttonText: "Try Summary AI Free",
    },
  },
  "ai-meeting-notes": {
    Hero: {
      title: "AI-Powered Meeting Notes",
      subtitle:
        "Automatically capture key points, decisions, and action items from every meeting. No more manual note-taking.",
    },
    BeforeAfter: {
      before: "Scrambling to write notes while trying to participate",
      after: "Stay fully engaged while AI captures everything",
    },
    CTA: {
      title: "Get Perfect Meeting Notes Every Time",
      buttonText: "Start Free Trial",
    },
  },
  "ai-meeting-summary": {
    Hero: {
      title: "AI Meeting Summary",
      subtitle:
        "Transform lengthy meetings into concise summaries with key points, decisions made, and action items—delivered to your email in seconds.",
    },
    BeforeAfter: {
      before: "Reading through hours of meeting recordings",
      after: "Get the essential points in a 2-minute summary",
    },
    CTA: {
      title: "Summarize Your Meetings Instantly",
      buttonText: "Try Summary AI",
    },
  },
  "meeting-transcription": {
    Hero: {
      title: "Real-Time Meeting Transcription",
      subtitle:
        "Summary AI joins your meetings and creates instant, accurate transcriptions. Never miss a word again.",
    },
    BeforeAfter: {
      before: "Rewatching recordings to find what was said",
      after: "Searchable transcripts delivered instantly",
    },
    CTA: {
      title: "Get Accurate Meeting Transcriptions",
      buttonText: "Start Transcribing Free",
    },
  },
  "automated-meeting-notes": {
    Hero: {
      title: "Automated Meeting Notes",
      subtitle:
        "Let AI handle your meeting notes. Summary AI captures everything and delivers organized summaries to your inbox automatically.",
    },
    BeforeAfter: {
      before: "Spending 30+ minutes writing up meeting notes",
      after: "Complete notes in your inbox before the meeting ends",
    },
    CTA: {
      title: "Automate Your Meeting Notes Today",
      buttonText: "Get Started Free",
    },
  },
  "ai-notetaker": {
    Hero: {
      title: "AI Notetaker for Meetings",
      subtitle:
        "Your intelligent meeting companion. Summary AI listens, transcribes, and creates perfect notes so you can focus on the conversation.",
    },
    BeforeAfter: {
      before: "Multitasking between listening and note-taking",
      after: "Be fully present while AI handles the notes",
    },
    CTA: {
      title: "Let AI Take Your Meeting Notes",
      buttonText: "Try AI Notetaker",
    },
  },
  "meeting-recorder": {
    Hero: {
      title: "Smart Meeting Recorder",
      subtitle:
        "More than just recording—Summary AI captures, transcribes, and summarizes your meetings automatically.",
    },
    BeforeAfter: {
      before: "Hours of recordings you'll never have time to review",
      after: "Actionable summaries delivered in seconds",
    },
    CTA: {
      title: "Record Smarter, Not Harder",
      buttonText: "Start Recording Free",
    },
  },
  "ai-meeting-recorder": {
    Hero: {
      title: "AI-Powered Meeting Recorder",
      subtitle:
        "Record meetings with intelligence. Get real-time transcription, smart summaries, and action items extracted automatically.",
    },
    BeforeAfter: {
      before: "Recordings that sit unwatched in your drive",
      after: "Instant insights from every recorded meeting",
    },
    CTA: {
      title: "Upgrade Your Meeting Recordings",
      buttonText: "Try AI Recording",
    },
  },
  "automatic-meeting-notes": {
    Hero: {
      title: "Automatic Meeting Notes",
      subtitle:
        "Summary AI joins your meetings, records conversations in real-time, and delivers perfect notes to your email—automatically.",
    },
    BeforeAfter: {
      before: "Forgetting key decisions and action items",
      after: "Every detail captured and organized automatically",
    },
    CTA: {
      title: "Get Automatic Meeting Notes",
      buttonText: "Start Free",
    },
  },
  "meeting-notes-ai": {
    Hero: {
      title: "Meeting Notes AI",
      subtitle:
        "The smartest way to capture meetings. AI-powered summaries with key points, decisions, and action items—saving you hours per meeting.",
    },
    BeforeAfter: {
      before: "Hours wasted on manual meeting documentation",
      after: "Minutes to get complete, organized meeting notes",
    },
    CTA: {
      title: "Transform How You Capture Meetings",
      buttonText: "Try Meeting Notes AI",
    },
  },
};

export default keywordConfigs;
