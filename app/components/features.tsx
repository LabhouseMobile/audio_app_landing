import Image from "next/image";
import BiPanel from "./bipanel";
import ChatBubble from "./chat_bubble";

export default function Features() {
  return (
    <div className="flex flex-col gap-8 pb-16 pt-32" id="features">
      <h2 className="text-center text-4xl font-bold">Features</h2>
      <BiPanel
        accentColor="#B5FFD6"
        leftColumn={
          <>
            <p className="text-2xl font-bold">
              Meticulous, organized and actionable notes
            </p>
            <p className="text-lg">
              Insightful notes with assigned action items. Written automatically
              after every meeting.
            </p>
          </>
        }
        rightColumn={
          <>
            <Image
              src="/feats/notes.webp"
              alt="Features"
              width={500}
              height={500}
              unoptimized
            />
          </>
        }
      />
      <BiPanel
        accentColor="#6982F9"
        inverted
        leftColumn={
          <>
            <p className="text-2xl font-bold">
              State-of-the-art transcription accuracy
            </p>
            <p className="text-lg">
              Technical terms and accent accuracy, and each speaker is
              automatically identified by name. Over 100 languages supported.
            </p>
          </>
        }
        rightColumn={
          <>
            <img
              src="/feats/wave.webp"
              width={50}
              height={50}
              alt="Audio waveform"
            />
            <Image
              src="/feats/l10n-hd.webp"
              alt="Features"
              width={500}
              height={500}
            />
          </>
        }
      />
      <BiPanel
        accentColor="#FFB2B2"
        leftColumn={
          <>
            <p className="text-2xl font-bold">
              Get instant notes from your{" "}
              <span className="text-blue-500">Gmeet</span>,{" "}
              <span className="text-blue-500">Teams</span> and{" "}
              <span className="text-blue-500">Zoom</span> calls.
            </p>
            <p className="text-lg">
              Connect your calendar and decide which meetings you want to
              record. Focus on the present while Summary does your notes for
              you.
            </p>
          </>
        }
        rightColumn={
          <>
            <Image
              src="/feats/calendar.webp"
              alt="Features"
              width={500}
              height={500}
            />
          </>
        }
      />
      <BiPanel
        accentColor="#C5F0FF"
        inverted
        leftColumn={
          <>
            <p className="text-2xl font-bold">Catch up Faster</p>
            <p className="text-lg">
              Paste any podcast or YouTube link - or upload your own file- and
              get a concise summary of the top insights, so you can absorb key
              ideas in seconds instead of spending hours listening.
            </p>
          </>
        }
        rightColumn={
          <>
            <Image
              src="/feats/youtube.webp"
              alt="Features"
              width={500}
              height={500}
            />
          </>
        }
      />
      <BiPanel
        accentColor="#FFC5EF"
        leftColumn={
          <>
            <p className="text-2xl font-bold">Ask AI about your notes</p>
            <p className="text-lg">
              Find any moment and detail from a meeting with an AI-powered chat
              that goes beyond the usual ⌘F
            </p>
          </>
        }
        rightColumn={
          <div className="md:min-h-[500px] flex flex-col gap-6 items-center justify-center">
            <ChatBubble
              name="You"
              content="What was the budget mentioned by the client?"
              url="/feats/chat-you.webp"
              accentColor="#FFC5EF"
              inverted
            />
            <ChatBubble
              name="Summary AI"
              content="Sara mentioned a budget of $150k for Q2"
              url="/feats/chat-bot.png"
              accentColor="#FFC5EF"
            />
          </div>
        }
      />
    </div>
  );
}
