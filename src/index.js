import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.css";
import UserProvider from './contexts/UserContext';
import ToastProvider from './contexts/ToastContext';

ReactDOM.render(
  <React.StrictMode>
    <ToastProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </ToastProvider>
  </React.StrictMode>,
  document.getElementById('root')
);