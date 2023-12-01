import React from 'react';
import ReactDOM from 'react-dom/client';
import '../static/frontend/style1.1.css';
import Chains from './components/App';

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(
  <React.StrictMode>
    <Chains />
  </React.StrictMode>
);
