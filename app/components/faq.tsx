"use client";
import React, { useState } from "react";

const faqData = [
  {
    question: "What is Summary AI?",
    answer: "Summary AI is a cutting-edge AI Note Taker designed for iOS, offering seamless recording, transcription, and summarization of your audio content. You can record meetings and phone calls, import podcasts and YouTube videos, and much more.",
  },
  {
    question: "How does Summary AI work?",
    answer: "Summary AI captures your audio, transcribes it into text, and then generates a succinct summary, all of which can be customized according to your needs.",
  },
  {
    question: "Is there a limit on recording time?",
    answer: "Our free plan only allows you one recording. Upgrade to Premium for unlimited use",
  },
  {
    question: "How accurate are the transcriptions?",
    answer: "Summary AI leverages Whisper v3, an open source transcription model from OpenAI, to ensure high accuracy in transcriptions. However, the clarity of the recording can also impact accuracy.",
  },
  {
    question: "Does Summary AI work in-person?",
    answer: "Yes, you can record in-person conversations with Summary AI, as well as import past audio meetings to get notes, action items, a searchable transcript and more",
  },
  {
    question: "What meeting platforms does Summary AI work with?",
    answer: "Summary AI supports in-person meetings and all meeting platforms, including:\n- Zoom\n- Google Meet\n- Microsoft Teams\nSummary AI connects with Google Calendar and Microsoft Outlook Calendar to detect and automatically join your meetings.",
  },
  {
    question: "How can I customize my summaries?",
    answer: "Once Summary AI has transcribed and summarized your audio, you can easily adjust the summary's length or format within the app.",
  },
  {
    question: "Can I use Summary AI while using other apps or with my screen off?",
    answer: "Yes, Summary AI can record in the background, allowing you to use other apps or even when your screen is off.",
  },
  {
    question: "What about my privacy?",
    answer: "Summary AI prioritizes your privacy. Read more about our commitment to your privacy in our Privacy Policy.",
  },
  {
    question: "Can I access Summary AI on multiple devices?",
    answer: "Currently, Summary AI is available on iOS (iPad and Mac with Apple Silicon)",
  },
  
  
];

const FAQItem = ({
  question,
  answer,
  isOpen,
  onClick,
}: {
  question: string;
  answer: React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
}) => {
  return (
    <li>
      <button
        className="relative flex w-full items-center gap-2 border-t border-slate-200 py-5 text-left text-base font-semibold md:text-lg"
        onClick={onClick}
        aria-expanded={isOpen}
      >
        <span className="flex-1 text-slate-800">{question}</span>
        <svg
          className={`ml-auto h-4 w-4 flex-shrink-0 fill-current transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M8 12L2 6h12l-6 6z" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="pb-5 leading-relaxed text-slate-600">
          {typeof answer === "string" ? <p className="whitespace-pre-line">{answer}</p> : answer}
        </div>
      </div>
    </li>
  );
};

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-slate-50" id="faq">
      <div className="mx-auto max-w-7xl px-8 py-24">
        <div className="flex flex-col gap-12 md:flex-row">
          <div className="flex basis-1/2 flex-col text-left">
            <p className="mb-4 inline-block font-bold text-blue-500">FAQ</p>
            <p className="text-3xl font-extrabold text-slate-800 md:text-4xl">
              Frequently Asked Questions
            </p>
          </div>
          <ul className="basis-1/2">
            {faqData.map((item, index) => (
              <FAQItem
                key={index}
                question={item.question}
                answer={item.answer}
                isOpen={openIndex === index}
                onClick={() => handleToggle(index)}
              />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
