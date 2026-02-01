import React from 'react';
import { COMMANDS } from '../../constants/commands';

export const HelpGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 my-2">
      {Object.entries(COMMANDS).map(([cmd, desc]) => (
        <div key={cmd} className="bg-terminal-green-dim bg-opacity-10 border border-terminal-green-dim p-2 rounded-sm flex flex-col">
          <span className="text-terminal-green font-bold uppercase mb-1">{cmd}</span>
          <span className="text-terminal-green-dim text-sm">{desc}</span>
        </div>
      ))}
    </div>
  );
};
