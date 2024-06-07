import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { UserProvider } from './context/UserContext';
import { TeamsProvider } from './context/TeamsContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <UserProvider>
          <TeamsProvider>
            <App />
          </TeamsProvider>
      </UserProvider>,
  </React.StrictMode>,
)
