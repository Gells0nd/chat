/************************************************
 *            КОРЕНЬ FRONTEND ЧАСТИ,            *
 * СЛУЖИТ ОБЕРТКОЙ РОУТЕРА ДЛЯ ВСЕГО ПРИЛОЖЕНИЯ *
 ************************************************/

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './assets/components/App';
import { BrowserRouter as Router } from 'react-router-dom';
import './assets/styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <App />
  </Router>
);
