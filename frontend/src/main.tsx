import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import BooksProvider from './context/Books/BooksProvider.tsx';
import AlertProvider from './context/Alert/AlertProvider.tsx';
import CategoryIdsProvider from './context/CategoryIds/CategoryIdsProvider.tsx';
import UserProvider from './context/User/UserProvider.tsx';
import { BrowserRouter } from 'react-router';
import App from './App.tsx';
import axios from 'axios';

axios.defaults.withCredentials = true;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AlertProvider>
        <BooksProvider>
          <CategoryIdsProvider>
            <UserProvider>
              <App />
            </UserProvider>
          </CategoryIdsProvider>
        </BooksProvider>
      </AlertProvider>
    </BrowserRouter>
  </StrictMode>
);
