// // src/components/SendNotificationButton.js
// import React, { useState } from 'react';
// import axios from 'axios';

// function SendNotificationButton() {
//   const [email, setEmail] = useState('');
//   const [message, setMessage] = useState('');

//   const handleSendNotification = async () => {
//     if (!email) {
//       setMessage('Please enter your email address.');
//       return;
//     }

//     try {
//       // Send a POST request to the notification endpoint
//       const response = await axios.post('http://localhost:6002/notify', {
//         email,
//       });

//       if (response.status === 200) {
//         setMessage('The news has been sent to your email successfully!');
//       } else {
//         setMessage('Failed to send the email. Please try again later.');
//       }
//     } catch (error) {
//       setMessage(`Error: ${error.response?.data?.error || error.message}`);
//     }
//   };

//   return (
//     <div>
//       <h3>Send News Notification via Email</h3>
//       <input
//         type="email"
//         placeholder="Enter your email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />
      
//       <button onClick={handleSendNotification}>Send News by Email</button>
//       {message && <p>{message}</p>}
//     </div>
//   );
// }

// export default SendNotificationButton;


import React, { useState } from 'react';
import axios from 'axios';

const SendNotificationButton = () => {
  const [email, setEmail] = useState('');
  const [preferences, setPreferences] = useState('');

  const handleSendNotification = async () => {
    if (!email || !preferences) {
      alert('Please provide both email and preferences.');
      return;
    }

    const preferencesArray = preferences.split(',').map(pref => pref.trim());

    try {
      const response = await axios.post('http://localhost:6002/notify', {
        email,
        preferences: preferencesArray
      });
      
      alert(response.data.message);
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Failed to send notification. Please try again later.');
    }
  };

  return (
    <div>
      <h2>Send Notification</h2>
      <input
        type="email"
        placeholder="Enter user email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Enter preferences (comma separated)"
        value={preferences}
        onChange={(e) => setPreferences(e.target.value)}
        required
      />
      <button onClick={handleSendNotification}>Send Notification</button>
    </div>
  );
};

export default SendNotificationButton;
