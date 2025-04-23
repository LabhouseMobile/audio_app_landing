import { clsx } from "clsx";
import Image from "next/image";

interface ChatBubbleProps {
  /**
   * The name of the sender
   */
  name: string;

  /**
   * The content of the message
   */
  content: string;

  /**
   * URL for the avatar image
   */
  url: string;

  /**
   * The accent color for the chat bubble
   */
  accentColor: string;

  /**
   * Whether the bubble layout should be inverted (right-aligned vs left-aligned)
   */
  inverted?: boolean;
}

export default function ChatBubble({
  name,
  content,
  url,
  accentColor,
  inverted = false,
}: ChatBubbleProps) {
  return (
    <div
      className={clsx(
        "flex max-w-[85%] gap-3",
        inverted ? "ml-auto flex-row-reverse" : "mr-auto"
      )}
    >
      <div className="flex-shrink-0">
        <div
          className="relative h-10 w-10 overflow-hidden rounded-full"
          style={{ borderColor: accentColor, borderWidth: "2px" }}
        >
          <Image
            src={url}
            alt={`${name}'s avatar`}
            fill
            className="object-cover"
          />
        </div>
      </div>

      <div
        className={clsx(
          "rounded-lg px-4 py-2 text-lg bg-white flex flex-col items-start",
          inverted ? "rounded-tr-none" : "rounded-tl-none"
        )}
      >
        <span
          className={clsx(
            "mt-1  font-bold text-blue-500",
            inverted ? "text-right" : "text-left"
          )}
        >
          {name}
        </span>
        <span>{content}</span>
      </div>
    </div>
  );
}
