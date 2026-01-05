/**
 * Parse and validate terminal commands
 */

export const parseCommand = (input) => {
  const trimmed = input.trim();
  
  if (!trimmed) {
    return { type: 'empty' };
  }

  if (trimmed.startsWith('/')) {
    return parseSystemCommand(trimmed);
  }

  return {
    type: 'ai',
    query: trimmed
  };
};

const parseSystemCommand = (input) => {
  const parts = input.slice(1).split(/\s+/);
  const command = parts[0].toLowerCase();
  const args = parts.slice(1);

  const commands = {
    help: { type: 'system', command: 'help', args: [] },
    clear: { type: 'system', command: 'clear', args: [] },
    ls: { type: 'system', command: 'ls', args },
    read: { type: 'system', command: 'read', args },
    write: { type: 'system', command: 'write', args },
    tree: { type: 'system', command: 'tree', args: [] },
    model: { type: 'system', command: 'model', args: [] },
    reset: { type: 'system', command: 'reset', args: [] },
    history: { type: 'system', command: 'history', args },
    cd: { type: 'system', command: 'cd', args },
    pwd: { type: 'system', command: 'pwd', args: [] },
    mkdir: { type: 'system', command: 'mkdir', args },
    rm: { type: 'system', command: 'rm', args },
    mv: { type: 'system', command: 'mv', args },
    cp: { type: 'system', command: 'cp', args }
  };

  if (commands[command]) {
    return commands[command];
  }

  return {
    type: 'unknown',
    command,
    args
  };
};

export const validateCommand = (parsed) => {
  if (parsed.type === 'empty') {
    return { valid: false, error: 'Empty command' };
  }

  if (parsed.type === 'unknown') {
    return { 
      valid: false, 
      error: `Unknown command: ${parsed.command}. Type /help for available commands.` 
    };
  }

  if (parsed.type === 'system') {
    return validateSystemCommand(parsed);
  }

  return { valid: true };
};

const validateSystemCommand = (parsed) => {
  const { command, args } = parsed;

  const requiredArgs = {
    read: 1,
    write: 1,
    cd: 1,
    mkdir: 1,
    rm: 1,
    mv: 2,
    cp: 2
  };

  if (requiredArgs[command] && args.length < requiredArgs[command]) {
    return {
      valid: false,
      error: `${command} requires ${requiredArgs[command]} argument(s)`
    };
  }

  return { valid: true };
};

export const formatCommandHelp = (command) => {
  const help = {
    help: 'Show available commands',
    clear: 'Clear terminal screen',
    ls: 'List directory contents. Usage: /ls [path]',
    read: 'Read file contents. Usage: /read <file>',
    write: 'Write to file. Usage: /write <file>',
    tree: 'Display file tree',
    model: 'Show current AI model',
    reset: 'Reset conversation context',
    history: 'Show command history',
    cd: 'Change directory. Usage: /cd <path>',
    pwd: 'Print working directory',
    mkdir: 'Create directory. Usage: /mkdir <name>',
    rm: 'Remove file/directory. Usage: /rm <path>',
    mv: 'Move/rename file. Usage: /mv <source> <dest>',
    cp: 'Copy file. Usage: /cp <source> <dest>'
  };

  return help[command] || 'No help available';
};

export const getCommandSuggestions = (partial) => {
  const commands = [
    '/help', '/clear', '/ls', '/read', '/write', '/tree',
    '/model', '/reset', '/history', '/cd', '/pwd',
    '/mkdir', '/rm', '/mv', '/cp'
  ];

  if (!partial || !partial.startsWith('/')) {
    return [];
  }

  return commands.filter(cmd => 
    cmd.toLowerCase().startsWith(partial.toLowerCase())
  );
};

export const escapeShellArg = (arg) => {
  return arg.replace(/(["'$`\\])/g, '\\$1');
};

export const parseQuotedArgs = (argsString) => {
  const regex = /[^\s"']+|"([^"]*)"|'([^']*)'/g;
  const args = [];
  let match;

  while ((match = regex.exec(argsString)) !== null) {
    args.push(match[1] || match[2] || match[0]);
  }

  return args;
};