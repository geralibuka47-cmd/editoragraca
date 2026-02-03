import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ToastProvider } from './components/Toast';
import { initSentry } from './services/sentry';

initSentry();

import { HelmetProvider } from 'react-helmet-async';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <HelmetProvider>
            <ToastProvider>
                <App />
            </ToastProvider>
        </HelmetProvider>
    </React.StrictMode>
);
