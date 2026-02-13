import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App'; // Neighbor in same folder
import '../index.css';       // UP one level in parent folder

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);