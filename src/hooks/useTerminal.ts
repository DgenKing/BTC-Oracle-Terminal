import { useState, useCallback, ReactNode } from 'react';
import { LogEntry } from '../types/terminal';

export function useTerminal() {
  const [history, setHistory] = useState<LogEntry[]>([
    {
      id: 'init-1',
      type: 'system',
      content: 'BTC ORACLE TERMINAL v0.1.0 INITIALIZED...',
      timestamp: new Date(),
    },
    {
      id: 'init-2',
      type: 'system',
      content: "READY FOR COMMAND. TYPE 'HELP' FOR ASSISTANCE.",
      timestamp: new Date(),
    },
  ]);

  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const addLog = useCallback((content: string, type: LogEntry['type'] = 'system', component?: ReactNode, scrollToTop?: boolean, isHelp?: boolean, shouldType?: boolean) => {
    const id = Math.random().toString(36).substring(2, 9);
    setHistory((prev) => [
      ...prev,
      {
        id,
        content,
        type,
        component,
        timestamp: new Date(),
        scrollToTop,
        isHelp,
        shouldType,
      },
    ]);

    if (type === 'user') {
      setCommandHistory(prev => [content, ...prev].slice(0, 50));
      setHistoryIndex(-1);
    }

    return id;
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const clearHelp = useCallback(() => {
    setHistory((prev) => prev.filter(entry => !entry.isHelp));
  }, []);

  const removeLog = useCallback((id: string) => {
    setHistory((prev) => prev.filter(entry => entry.id !== id));
  }, []);

  const getPreviousCommand = useCallback(() => {
    if (commandHistory.length === 0) return null;
    const nextIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
    setHistoryIndex(nextIndex);
    return commandHistory[nextIndex];
  }, [commandHistory, historyIndex]);

  const getNextCommand = useCallback(() => {
    if (historyIndex <= 0) {
      setHistoryIndex(-1);
      return '';
    }
    const nextIndex = historyIndex - 1;
    setHistoryIndex(nextIndex);
    return commandHistory[nextIndex];
  }, [commandHistory, historyIndex]);

  return {
    history,
    addLog,
    clearHistory,
    clearHelp,
    removeLog,
    getPreviousCommand,
    getNextCommand,
  };
}
