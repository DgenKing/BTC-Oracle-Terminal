import { ReactNode } from 'react';

export interface LogEntry {
  id: string;
  type: 'system' | 'user' | 'error' | 'success' | 'info' | 'danger';
  content?: string;
  component?: ReactNode;
  timestamp: Date;
  scrollToTop?: boolean;
  isHelp?: boolean;
}

export type CommandHandler = (args: string[]) => Promise<void> | void;
