import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CreateAccount from './component/auth/CreateAccount';
import ChatNavigator from './component/chat/ChatNavigator';

function App() {
  const [isCreateAccount, setIsCreateAccount] = useState(
    !!localStorage.getItem('token')
  );

  return (
    isCreateAccount ? (
      <ChatNavigator setIsCreateAccount={setIsCreateAccount} />
    ) : (
      <CreateAccount setIsCreateAccount={setIsCreateAccount} />
    )
  );
}

export default App;

