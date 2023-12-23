// components/AuthPrompt.js
import React from 'react';
import EnvironmentPrompt from './EnvironmentPrompt';

const AuthPrompt = () => {
  return (
    <div>
      <h1>Authentication Required</h1>
      <EnvironmentPrompt />
    </div>
  );
};

export default AuthPrompt;
