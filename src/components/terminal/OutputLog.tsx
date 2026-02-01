import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogEntry } from '../../types/terminal';

interface OutputLogProps {
  history: LogEntry[];
}

export const OutputLog: React.FC<OutputLogProps> = ({ history }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      // Find if any new entry has scrollToTop set
      const targetEntry = history.find(e => e.scrollToTop);
      if (targetEntry) {
        const element = document.getElementById(`log-${targetEntry.id}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
      }
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const getTypeColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'user': return 'text-terminal-green';
      case 'system': return 'text-terminal-amber';
      case 'error': return 'text-terminal-red';
      case 'danger': return 'text-terminal-red';
      case 'success': return 'text-terminal-green text-glow';
      case 'info': return 'text-terminal-green-dim';
      default: return 'text-terminal-green';
    }
  };

  return (
    <div 
      ref={scrollRef}
      className="flex-grow overflow-y-auto mb-4 font-terminal text-xl scrollbar-hide scroll-smooth"
    >
      <AnimatePresence initial={false}>
        {history.map((entry) => (
          <motion.div
            key={entry.id}
            id={`log-${entry.id}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="mb-2 flex gap-2"
          >
            {entry.component ? (
              <div className="w-full">{entry.component}</div>
            ) : (
              <>
                <span className={getTypeColor(entry.type)}>
                  {entry.type === 'user' ? '>' : `[${entry.type === 'danger' ? 'ALERT' : entry.type.toUpperCase()}]:`}
                </span>
                <span className="whitespace-pre-wrap">{entry.content}</span>
              </>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
