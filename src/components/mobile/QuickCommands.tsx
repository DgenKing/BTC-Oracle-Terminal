import React from 'react';

interface QuickCommandsProps {
  onCommand: (cmd: string) => void;
  onType: (text: string) => void;
}

const QUICK_CMDS = [
  { label: 'PLAY', cmd: 'play', action: 'run', color: 'border-terminal-green text-terminal-green' },
  { label: 'BIAS', cmd: 'bias', action: 'run', color: 'border-terminal-green text-terminal-green' },
  { label: 'SENTIMENT', cmd: 'sentiment', action: 'run', color: 'border-terminal-green text-terminal-green' },
  
  { label: 'PRICE', cmd: 'price', action: 'run', color: 'border-terminal-green text-terminal-green' },
  { label: 'GAPS', cmd: 'gaps', action: 'run', color: 'border-terminal-amber text-terminal-amber' },
  { label: 'RSI', cmd: 'rsi', action: 'run', color: 'border-terminal-green-dim text-terminal-green-dim' },
  { label: 'MA', cmd: 'ma', action: 'run', color: 'border-terminal-green-dim text-terminal-green-dim' },

  { label: 'FUNDING', cmd: 'funding', action: 'run', color: 'border-terminal-amber text-terminal-amber' },
  { label: 'OI', cmd: 'oi', action: 'run', color: 'border-terminal-green text-terminal-green' },
  { label: 'LS', cmd: 'lsratio', action: 'run', color: 'border-terminal-green-dim text-terminal-green-dim' },
  { label: 'ASK', cmd: 'ask ', action: 'type', color: 'border-terminal-green text-terminal-green' },

  { label: 'CALC', cmd: 'calc ', action: 'type', color: 'border-terminal-green-dim text-terminal-green-dim' },
  { label: 'SIZE', cmd: 'size ', action: 'type', color: 'border-terminal-green-dim text-terminal-green-dim' },
  { label: 'ANALYZE', cmd: 'analyze ', action: 'type', color: 'border-terminal-green-dim text-terminal-green-dim' },
  { label: 'USAGE', cmd: 'usage', action: 'run', color: 'border-terminal-green-dim text-terminal-green-dim' },

  { label: 'HELP', cmd: 'help', action: 'run', color: 'border-terminal-green-dim text-terminal-green-dim' },
  { label: 'CLEAR', cmd: 'clear', action: 'run', color: 'border-terminal-red text-terminal-red' },
];

export const QuickCommands: React.FC<QuickCommandsProps> = ({ onCommand, onType }) => {
  return (
    <div className="md:hidden grid grid-cols-4 gap-1 p-2 border-t border-terminal-green-dim bg-terminal-bg z-50">
      {QUICK_CMDS.map((item) => (
        <button
          key={item.label}
          onClick={() => item.action === 'run' ? onCommand(item.cmd) : onType(item.cmd)}
          className={`
            ${item.color} border border-opacity-50 
            bg-opacity-10 hover:bg-opacity-20 active:bg-opacity-30
            font-terminal text-xs py-1 px-1 rounded-sm
            uppercase tracking-tight transition-all
            hover:shadow-[0_0_5px_rgba(0,255,65,0.2)]
            active:scale-95
          `}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};
