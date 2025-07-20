import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import BooksProvider from './context/BooksProvider.tsx';
import AlertProvider from './context/AlertProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AlertProvider>
      <BooksProvider>
        <App />
      </BooksProvider>
    </AlertProvider>
  </StrictMode>
);
