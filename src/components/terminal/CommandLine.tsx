import React from 'react';

interface CommandLineProps {
  onCommand: (command: string) => void;
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

export const CommandLine: React.FC<CommandLineProps> = ({ onCommand, value, onChange, onKeyDown }) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onCommand(value.trim());
      onChange(''); // Clear after submit
      inputRef.current?.blur(); // Dismiss keyboard
    }
  };

  const handleFocus = () => {
    // Small delay to allow keyboard to pop up before scrolling
    setTimeout(() => {
      inputRef.current?.scrollIntoView({ block: 'end', behavior: 'smooth' });
    }, 300);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-terminal-green-dim pt-2">
      <span className="text-terminal-green text-xl font-terminal">{'>'}</span>
      <input
        ref={inputRef}
        type="text"
        className="terminal-input"
        autoFocus
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onFocus={handleFocus}
        placeholder="..."
        spellCheck={false}
        autoComplete="off"
      />
    </form>
  );
};
