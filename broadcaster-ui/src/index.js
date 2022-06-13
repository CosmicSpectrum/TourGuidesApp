import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ContextProvider } from './context/appContext';
import { BrowserRouter as Router } from 'react-router-dom';
import './fonts/Assistant-VariableFont_wght.ttf';
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ContextProvider>
      <Router>
        <div className='font'>
          <App />
        </div>
      </Router>
    </ContextProvider>
  </React.StrictMode>
);

