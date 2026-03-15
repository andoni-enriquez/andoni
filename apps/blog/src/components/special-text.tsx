"use client";

import { useEffect, useRef, useState } from "react";

const RANDOM_CHARS = "_!X$0-+*#";
const SPEED = 20;

function getRandomChar(prevChar?: string): string {
  let char: string;
  do {
    char = RANDOM_CHARS[
      Math.floor(Math.random() * RANDOM_CHARS.length)
    ] as string;
  } while (char === prevChar);
  return char;
}

function SpecialText({
  children: text,
  className = "",
  onComplete,
}: {
  children: string;
  className?: string;
  onComplete?: () => void;
}) {
  const [displayText, setDisplayText] = useState(" ".repeat(text.length));
  const stepRef = useRef(0);
  const phaseRef = useRef<"phase1" | "phase2">("phase1");

  useEffect(() => {
    stepRef.current = 0;
    phaseRef.current = "phase1";
    setDisplayText(" ".repeat(text.length));

    const interval = setInterval(() => {
      if (phaseRef.current === "phase1") {
        const step = stepRef.current;
        const maxSteps = text.length * 2;
        const currentLength = Math.min(step + 1, text.length);

        const chars: string[] = [];
        for (let i = 0; i < currentLength; i++) {
          const prevChar = i > 0 ? chars[i - 1] : undefined;
          chars.push(getRandomChar(prevChar));
        }
        for (let i = currentLength; i < text.length; i++) {
          chars.push("\u00A0");
        }

        setDisplayText(chars.join(""));

        if (step < maxSteps - 1) {
          stepRef.current = step + 1;
        } else {
          phaseRef.current = "phase2";
          stepRef.current = 0;
        }
      } else {
        const step = stepRef.current;
        const revealedCount = Math.floor(step / 2);
        const chars: string[] = [];

        for (let i = 0; i < revealedCount && i < text.length; i++) {
          chars.push(text[i] as string);
        }

        if (revealedCount < text.length) {
          if (step % 2 === 0) {
            chars.push("_");
          } else {
            chars.push(getRandomChar());
          }
        }

        for (let i = chars.length; i < text.length; i++) {
          chars.push(getRandomChar());
        }

        setDisplayText(chars.join(""));

        if (step < text.length * 2 - 1) {
          stepRef.current = step + 1;
        } else {
          setDisplayText(text);
          clearInterval(interval);
          onComplete?.();
        }
      }
    }, SPEED);

    return () => clearInterval(interval);
  }, [text, onComplete]);

  return (
    <span
      className={`h-4.5 leading-5 inline-flex font-mono font-medium ${className}`}
    >
      {displayText}
    </span>
  );
}

export function SpecialTitle({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  const [triggered, setTriggered] = useState(false);
  const hasPlayed = useRef(false);

  return (
    <span
      onMouseEnter={() => {
        if (!hasPlayed.current) {
          setTriggered(true);
        }
      }}
    >
      {triggered ? (
        <SpecialText
          className={className ?? ""}
          onComplete={() => {
            hasPlayed.current = true;
          }}
        >
          {children}
        </SpecialText>
      ) : (
        <span
          className={`h-4.5 leading-5 inline-flex font-mono font-medium ${className ?? ""}`}
        >
          {children}
        </span>
      )}
    </span>
  );
}
