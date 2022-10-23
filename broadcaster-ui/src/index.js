import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ContextProvider } from './context/appContext';
import { BrowserRouter as Router } from 'react-router-dom';
import {Worker} from '@react-pdf-viewer/core';
import './fonts/Assistant-VariableFont_wght.ttf';
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ContextProvider>
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.15.349/build/pdf.worker.min.js">
        <Router>
          <div className='font'>
            <App />
          </div>
        </Router>
      </Worker>
    </ContextProvider>
  </React.StrictMode>
);

