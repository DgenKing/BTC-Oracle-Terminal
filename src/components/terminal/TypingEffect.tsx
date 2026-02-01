import React, { useState, useEffect } from 'react';

interface TypingEffectProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

export const TypingEffect: React.FC<TypingEffectProps> = ({ text, speed = 10, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [index, text, speed, onComplete]);

  return <span className="whitespace-pre-wrap">{displayedText}</span>;
};
