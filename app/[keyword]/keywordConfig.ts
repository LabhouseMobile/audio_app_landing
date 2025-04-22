export type ComponentConfig = {
  [key: string]: any;
};

export type KeywordConfig = {
  [component: string]: ComponentConfig;
};

const keywordConfigs: { [keyword: string]: KeywordConfig } = {
  "ai-summary-app": {
    Hero: {
      title: "AI-Powered Summary App",
      subtitle: "Transcribe and summarize in minutes with AI assistance",
    },
    AccordionFeatures: {
      features: [
        { title: "Automatic Question Generation", description: "..." },
        { title: "Customizable Difficulty Levels", description: "..." },
      ],
    },
    BeforeAfter: {
      before: "Hours spent creating quizzes manually",
      after: "Minutes to generate AI-powered quizzes",
    },
    FAQ: {
      questions: [
        { question: "How does AI quiz creation work?", answer: "..." },
        { question: "Can I customize the generated quizzes?", answer: "..." },
      ],
    },
    CTA: {
      title: "Start Creating AI-Powered Quizzes Today",
      buttonText: "Try AI Quiz Creator",
    },
  },
  "ai-lesson-planning": {
    Hero: {
      title: "AI-Powered Lesson Planning",
      subtitle: "Create engaging lessons in minutes with AI assistance",
    },
  },
};

export default keywordConfigs;
