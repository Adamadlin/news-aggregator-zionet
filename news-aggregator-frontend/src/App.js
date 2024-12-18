
import './App.css';

import React from 'react';
import RegisterUser from './components/RegisterUser';
import UpdatePreferences from './components/UpdatePreferences';
import SendNotificationButton from './components/SendNotificationButton';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>News Aggregator</h1>
        <RegisterUser />
        <UpdatePreferences />
        <SendNotificationButton />
      </header>
    </div>
  );
}

export default App;
