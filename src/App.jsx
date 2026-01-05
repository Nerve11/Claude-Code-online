import React, { useState, useEffect } from 'react';
import Terminal from './components/Terminal';
import AuthButton from './components/AuthButton';
import ModelSelector from './components/ModelSelector';
import { initPuter, checkAuth } from './services/puterService';
import './styles/terminal.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedModel, setSelectedModel] = useState('claude-3-5-sonnet');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        await initPuter();
        const authStatus = await checkAuth();
        setIsAuthenticated(authStatus.isSignedIn);
        if (authStatus.user) {
          setUser(authStatus.user);
        }
      } catch (error) {
        console.error('Init error:', error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleAuth = async () => {
    try {
      await window.puter.auth.signIn();
      const user = await window.puter.auth.getUser();
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Auth error:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await window.puter.auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading Puter.js...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-left">
          <h1>Claude Code Online</h1>
          <span className="badge">Powered by Puter.js</span>
        </div>
        <div className="header-right">
          {isAuthenticated && (
            <ModelSelector 
              selectedModel={selectedModel} 
              onModelChange={setSelectedModel}
            />
          )}
          <AuthButton 
            isAuthenticated={isAuthenticated}
            user={user}
            onSignIn={handleAuth}
            onSignOut={handleSignOut}
          />
        </div>
      </header>
      
      <main className="app-main">
        {!isAuthenticated ? (
          <div className="welcome-screen">
            <h2>Welcome to Claude Code Online</h2>
            <p>Sign in with your Puter account to start coding with AI assistance</p>
            <button className="btn-primary" onClick={handleAuth}>
              Sign In with Puter
            </button>
          </div>
        ) : (
          <Terminal 
            user={user} 
            selectedModel={selectedModel}
          />
        )}
      </main>
    </div>
  );
}

export default App;