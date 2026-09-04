import React from "react";
import { Text} from "react-native";
import { twMerge } from "tailwind-merge";
import { wordStartAt } from "../../utils/kid";

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

  // Scan back to the whitespace before the cursor. The previous regex matched
  // the last whitespace on the current line and then used lastIndexOf on that
  // character, which picked the wrong boundary whenever a space appeared
  // earlier in the string than the newline that actually starts the word.
  const wordStart = wordStartAt(text, start);

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