import React from 'react';

const AuthButton = ({ isAuthenticated, user, onSignIn, onSignOut }) => {
  if (!isAuthenticated) {
    return (
      <button className="auth-button" onClick={onSignIn}>
        Sign In
      </button>
    );
  }

  return (
    <div className="user-info">
      <div className="user-avatar">
        {user?.username?.charAt(0).toUpperCase() || 'U'}
      </div>
      <div className="user-details">
        <span className="username">{user?.username}</span>
        <button className="sign-out" onClick={onSignOut}>
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default AuthButton;