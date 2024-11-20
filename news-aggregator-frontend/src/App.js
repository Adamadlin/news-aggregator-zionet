

import React, { useState } from 'react';
import Register from './Register';
import Users from './Users';

function App() {
  const [registeredUserData, setRegisteredUserData] = useState(null);

  const handleRegister = (data) => {
    setRegisteredUserData(data);
    console.log("User registered successfully:", data);
  };

  return (
    <div className="App">
      <h1>News Aggregator</h1>
      <Register onRegister={handleRegister} />
      <Users />
      {registeredUserData && (
        <div>
          <h2>Registered User Data</h2>
          <pre>{JSON.stringify(registeredUserData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;

