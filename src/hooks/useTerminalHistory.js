import { useState, useEffect } from 'react';

const HISTORY_KEY = 'claude-code-terminal-history';
const MAX_HISTORY = 100;

export const useTerminalHistory = () => {
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save history:', error);
    }
  }, [history]);

  const addToHistory = (command) => {
    if (!command.trim()) return;
    
    setHistory(prev => {
      const newHistory = [command, ...prev.filter(cmd => cmd !== command)];
      return newHistory.slice(0, MAX_HISTORY);
    });
    setHistoryIndex(-1);
  };

  const navigateHistory = (direction) => {
    if (history.length === 0) return null;

    let newIndex;
    if (direction === 'up') {
      newIndex = Math.min(historyIndex + 1, history.length - 1);
    } else {
      newIndex = Math.max(historyIndex - 1, -1);
    }

    setHistoryIndex(newIndex);
    return newIndex === -1 ? '' : history[newIndex];
  };

  const clearHistory = () => {
    setHistory([]);
    setHistoryIndex(-1);
    localStorage.removeItem(HISTORY_KEY);
  };

  const searchHistory = (query) => {
    if (!query.trim()) return history;
    return history.filter(cmd => 
      cmd.toLowerCase().includes(query.toLowerCase())
    );
  };

  return {
    history,
    historyIndex,
    addToHistory,
    navigateHistory,
    clearHistory,
    searchHistory
  };
};

export default useTerminalHistory;