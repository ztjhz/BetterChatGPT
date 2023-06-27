import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './main.css';
import { Analytics } from '@vercel/analytics/react';
import { Helmet } from 'react-helmet';

await import('katex/dist/katex.min.css');

import './i18n';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
    <Analytics />
  </React.StrictMode>
);
