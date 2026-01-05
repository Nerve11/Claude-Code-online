import React, { useEffect, useRef, useState } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { chat, executeCommand, getFileTree } from '../services/claudeService';

const Terminal = ({ user, selectedModel }) => {
  const terminalRef = useRef(null);
  const xtermRef = useRef(null);
  const fitAddonRef = useRef(null);
  const [currentLine, setCurrentLine] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [conversationContext, setConversationContext] = useState([]);

  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new XTerm({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      theme: {
        background: '#1e1e1e',
        foreground: '#d4d4d4',
        cursor: '#ffffff',
        selection: '#264f78',
        black: '#000000',
        red: '#cd3131',
        green: '#0dbc79',
        yellow: '#e5e510',
        blue: '#2472c8',
        magenta: '#bc3fbc',
        cyan: '#11a8cd',
        white: '#e5e5e5',
        brightBlack: '#666666',
        brightRed: '#f14c4c',
        brightGreen: '#23d18b',
        brightYellow: '#f5f543',
        brightBlue: '#3b8eea',
        brightMagenta: '#d670d6',
        brightCyan: '#29b8db',
        brightWhite: '#e5e5e5'
      },
      rows: 30,
      cols: 100
    });

    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();
    
    term.loadAddon(fitAddon);
    term.loadAddon(webLinksAddon);
    term.open(terminalRef.current);
    
    fitAddon.fit();
    
    xtermRef.current = term;
    fitAddonRef.current = fitAddon;

    term.writeln('\x1b[1;32mClaude Code Online\x1b[0m - AI-powered coding assistant');
    term.writeln(`Authenticated as: \x1b[1;36m${user.username}\x1b[0m`);
    term.writeln(`Model: \x1b[1;35m${selectedModel}\x1b[0m`);
    term.writeln('');
    term.writeln('Type \x1b[1;33m/help\x1b[0m for available commands');
    term.writeln('');
    prompt();

    let line = '';

    term.onData(async (data) => {
      const code = data.charCodeAt(0);

      if (code === 13) { // Enter
        term.writeln('');
        if (line.trim()) {
          await processCommand(line.trim());
          setHistory(prev => [...prev, line]);
          setHistoryIndex(-1);
        }
        line = '';
        prompt();
      } else if (code === 127) { // Backspace
        if (line.length > 0) {
          line = line.slice(0, -1);
          term.write('\b \b');
        }
      } else if (code === 27) { // Escape sequences (arrows)
        return;
      } else if (code < 32) { // Control characters
        return;
      } else {
        line += data;
        term.write(data);
      }
      setCurrentLine(line);
    });

    const handleResize = () => {
      fitAddon.fit();
    };
    
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      term.dispose();
    };
  }, [user, selectedModel]);

  const prompt = () => {
    if (xtermRef.current) {
      xtermRef.current.write('\x1b[1;32m❯\x1b[0m ');
    }
  };

  const processCommand = async (input) => {
    const term = xtermRef.current;
    if (!term) return;

    if (input.startsWith('/')) {
      await handleSystemCommand(input);
    } else {
      await handleAIQuery(input);
    }
  };

  const handleSystemCommand = async (cmd) => {
    const term = xtermRef.current;
    const parts = cmd.slice(1).split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (command) {
      case 'help':
        term.writeln('\x1b[1;33mAvailable Commands:\x1b[0m');
        term.writeln('  /help          - Show this help message');
        term.writeln('  /clear         - Clear terminal');
        term.writeln('  /ls [path]     - List files in directory');
        term.writeln('  /read <file>   - Read file contents');
        term.writeln('  /write <file>  - Write to file (interactive)');
        term.writeln('  /tree          - Show file tree');
        term.writeln('  /model         - Show current model');
        term.writeln('  /reset         - Reset conversation context');
        term.writeln('');
        term.writeln('\x1b[1;36mAI Commands:\x1b[0m');
        term.writeln('  Just type your question or request naturally');
        term.writeln('  Examples:');
        term.writeln('    - "Create a React component for user login"');
        term.writeln('    - "Explain this code: async function getData()"');
        term.writeln('    - "Fix the bug in authentication.js"');
        break;

      case 'clear':
        term.clear();
        break;

      case 'ls':
        await executeFileCommand('ls', args[0] || './');
        break;

      case 'read':
        if (args.length === 0) {
          term.writeln('\x1b[1;31mError: Specify file path\x1b[0m');
        } else {
          await executeFileCommand('read', args[0]);
        }
        break;

      case 'tree':
        await executeFileCommand('tree');
        break;

      case 'model':
        term.writeln(`\x1b[1;35mCurrent model: ${selectedModel}\x1b[0m`);
        break;

      case 'reset':
        setConversationContext([]);
        term.writeln('\x1b[1;32mConversation context reset\x1b[0m');
        break;

      default:
        term.writeln(`\x1b[1;31mUnknown command: ${command}\x1b[0m`);
        term.writeln('Type \x1b[1;33m/help\x1b[0m for available commands');
    }
  };

  const executeFileCommand = async (cmd, arg) => {
    const term = xtermRef.current;
    try {
      const result = await executeCommand(cmd, arg);
      if (result.error) {
        term.writeln(`\x1b[1;31m${result.error}\x1b[0m`);
      } else {
        term.writeln(result.output);
      }
    } catch (error) {
      term.writeln(`\x1b[1;31mError: ${error.message}\x1b[0m`);
    }
  };

  const handleAIQuery = async (query) => {
    const term = xtermRef.current;
    
    term.writeln('\x1b[2m[Processing with AI...]\x1b[0m');
    
    try {
      const context = [...conversationContext, { role: 'user', content: query }];
      
      const response = await chat(query, selectedModel, context);
      
      term.writeln('');
      term.writeln('\x1b[1;36m🤖 Claude:\x1b[0m');
      term.writeln(response);
      term.writeln('');
      
      setConversationContext([
        ...context,
        { role: 'assistant', content: response }
      ]);
      
    } catch (error) {
      term.writeln(`\x1b[1;31mError: ${error.message}\x1b[0m`);
    }
  };

  return (
    <div className="terminal-container">
      <div className="terminal-wrapper" ref={terminalRef} />
    </div>
  );
};

export default Terminal;