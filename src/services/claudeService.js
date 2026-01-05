import { readFile, listDirectory, writeFile } from './puterService';

export const chat = async (message, model, context = []) => {
  try {
    const messages = context.length > 0 ? context : [
      {
        role: 'system',
        content: `You are Claude Code, an AI coding assistant running in a web terminal. You help developers write code, debug issues, and understand codebases.

Capabilities:
- Write and explain code in any programming language
- Debug and fix code issues
- Suggest improvements and best practices
- Answer technical questions
- Analyze code structure and patterns

When responding:
- Be concise and technical
- Provide code examples when relevant
- Use proper formatting for code blocks
- Explain your reasoning clearly`
      },
      { role: 'user', content: message }
    ];

    const response = await window.puter.ai.chat(messages, { model });
    
    if (typeof response === 'string') {
      return response;
    } else if (response.message) {
      return response.message.content || response.message;
    } else if (response.choices && response.choices[0]) {
      return response.choices[0].message.content;
    }
    
    return JSON.stringify(response);
  } catch (error) {
    throw new Error(`AI chat failed: ${error.message}`);
  }
};

export const executeCommand = async (command, arg) => {
  try {
    switch (command) {
      case 'ls': {
        const items = await listDirectory(arg || './');
        const output = items.map(item => {
          const icon = item.is_dir ? '📁' : '📄';
          const name = item.name || item.path.split('/').pop();
          return `${icon} ${name}`;
        }).join('\n');
        return { output: output || 'Empty directory' };
      }

      case 'read': {
        const content = await readFile(arg);
        return { output: content };
      }

      case 'tree': {
        const items = await listDirectory('./');
        const tree = buildTree(items);
        return { output: tree };
      }

      default:
        return { error: `Unknown command: ${command}` };
    }
  } catch (error) {
    return { error: error.message };
  }
};

const buildTree = (items, prefix = '', isLast = true) => {
  if (!items || items.length === 0) return 'Empty directory';
  
  let output = '';
  items.forEach((item, index) => {
    const isLastItem = index === items.length - 1;
    const connector = isLastItem ? '└── ' : '├── ';
    const icon = item.is_dir ? '📁' : '📄';
    const name = item.name || item.path.split('/').pop();
    output += `${prefix}${connector}${icon} ${name}\n`;
  });
  
  return output;
};

export const getFileTree = async (path = './') => {
  try {
    const items = await listDirectory(path);
    return items;
  } catch (error) {
    throw error;
  }
};