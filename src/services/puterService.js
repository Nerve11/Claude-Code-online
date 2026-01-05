export const initPuter = async () => {
  return new Promise((resolve) => {
    if (window.puter) {
      resolve(window.puter);
    } else {
      const checkPuter = setInterval(() => {
        if (window.puter) {
          clearInterval(checkPuter);
          resolve(window.puter);
        }
      }, 100);
    }
  });
};

export const checkAuth = async () => {
  try {
    const isSignedIn = window.puter.auth.isSignedIn();
    let user = null;
    
    if (isSignedIn) {
      user = await window.puter.auth.getUser();
    }
    
    return { isSignedIn, user };
  } catch (error) {
    console.error('Auth check error:', error);
    return { isSignedIn: false, user: null };
  }
};

export const signIn = async () => {
  try {
    await window.puter.auth.signIn();
    return await window.puter.auth.getUser();
  } catch (error) {
    throw new Error(`Sign in failed: ${error.message}`);
  }
};

export const signOut = async () => {
  try {
    await window.puter.auth.signOut();
  } catch (error) {
    throw new Error(`Sign out failed: ${error.message}`);
  }
};

export const getAvailableModels = async () => {
  try {
    const models = await window.puter.ai.listModels();
    return models.filter(m => m.id && !m.id.includes('embedding'));
  } catch (error) {
    console.error('Failed to fetch models:', error);
    return [
      { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic' },
      { id: 'claude-3-5-haiku', name: 'Claude 3.5 Haiku', provider: 'Anthropic' },
      { id: 'gpt-4.1', name: 'GPT-4.1', provider: 'OpenAI' },
      { id: 'gpt-4.1-nano', name: 'GPT-4.1 Nano', provider: 'OpenAI' },
      { id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash', provider: 'Google' },
      { id: 'deepseek-v3', name: 'DeepSeek V3', provider: 'DeepSeek' }
    ];
  }
};

export const readFile = async (path) => {
  try {
    const content = await window.puter.fs.read(path);
    return content;
  } catch (error) {
    throw new Error(`Failed to read file: ${error.message}`);
  }
};

export const writeFile = async (path, content) => {
  try {
    await window.puter.fs.write(path, content);
    return true;
  } catch (error) {
    throw new Error(`Failed to write file: ${error.message}`);
  }
};

export const listDirectory = async (path = './') => {
  try {
    const items = await window.puter.fs.readdir(path);
    return items;
  } catch (error) {
    throw new Error(`Failed to list directory: ${error.message}`);
  }
};

export const createDirectory = async (path) => {
  try {
    await window.puter.fs.mkdir(path);
    return true;
  } catch (error) {
    throw new Error(`Failed to create directory: ${error.message}`);
  }
};

export const deleteFile = async (path) => {
  try {
    await window.puter.fs.delete(path);
    return true;
  } catch (error) {
    throw new Error(`Failed to delete file: ${error.message}`);
  }
};