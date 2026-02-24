import React from "react";
import { Text} from "react-native";
import { twMerge } from "tailwind-merge";

export const KaraokeText = ({
  text,
  isActive,
  charIndex,
  className,
}: {
  text: string;
  isActive: boolean;
  charIndex: number | null;
  className?: string;
}) => {
  if (!isActive || charIndex == null || charIndex < 0) {
    return <Text className={className}>{text}</Text>;
  }

  const start = Math.min(Math.max(0, charIndex), text.length);
  const after = text.slice(start);
  const match = after.match(/[\s\n\t]/);
  const relativeWordEnd = match ? match.index! : after.length;
  const wordEnd = start + relativeWordEnd;

  const before = text.slice(0, start);
  const beforeMatch = before.match(/[\s\n\t](?!.*[\s\n\t])/);

  let wordStart = 0;

  if (beforeMatch) {
    const lastWhitespacePos = before.lastIndexOf(beforeMatch[0]);
    wordStart = lastWhitespacePos + 1;
  }

  const prefix = text.slice(0, wordStart);
  const currentWord = text.slice(wordStart, wordEnd);
  const suffix = text.slice(wordEnd);

  return (
    <Text className={className}>
      <Text>{prefix}</Text>
      <Text className="bg-[#FFD700] px-1 rounded-sm">{currentWord}</Text>
      <Text>{suffix}</Text>
    </Text>
  );
};