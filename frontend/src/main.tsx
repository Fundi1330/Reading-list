import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import BooksProvider from './context/BooksProvider.tsx';
import AlertProvider from './context/AlertProvider.tsx';
import CategoryIdsProvider from './context/CategoryIdsProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AlertProvider>
      <BooksProvider>
        <CategoryIdsProvider>
          <App />
        </CategoryIdsProvider>
      </BooksProvider>
    </AlertProvider>
  </StrictMode>
);
