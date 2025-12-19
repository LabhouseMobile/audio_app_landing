"use client";

import { ActionItem } from "@/app/lib/firebase/recording/@types";
import clsx from "clsx";
import { useTransition } from "react";
import useSWR, { mutate } from "swr";

interface ActionItemProps {
  item: ActionItem;
  recordingId: string;
  userId: string;
  speakers: Record<string, string>;
}

export default function ActionItemView({
  item,
  recordingId,
  userId,
  speakers,
}: ActionItemProps) {
  const [isPending] = useTransition();
  const { data: isDone = item.isDone } = useSWR(
    `recording-${recordingId}-action-${item.id}`,
    null,
    { fallbackData: item.isDone }
  );

  const toggle = async () => {
    const newValue = !isDone;

    mutate(`recording-${recordingId}-action-${item.id}`, newValue, false); // optimistic

    const requestBody = {
      recordingId,
      actionItemId: item.id,
      checked: newValue,
      userId,
    };

    const response = await fetch(`/api/toggle-action`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData);
    }

    mutate(`recording-${recordingId}-action-${item.id}`);
  };

  return (
    <div className="flex flex-col items-start space-y-2 text-slate-500">
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          className="rounded-md h-5 w-5 border-gray-300 focus:ring-none focus:ring-gray-300 cursor-pointer"
          checked={isDone}
          onChange={toggle}
          disabled={isPending}
        />
        <label className={clsx("font-semibold text-slate-800 cursor-text")}>
          <span
            className={clsx(
              "py-1 px-2 mr-2 rounded bg-blue-500/10 text-blue-500"
            )}
          >
            {speakers[item.actor] || item.actor}
          </span>
          {item.title}
        </label>
      </div>
      <div className="text-sm font-medium">{item.description}</div>
    </div>
  );
}
