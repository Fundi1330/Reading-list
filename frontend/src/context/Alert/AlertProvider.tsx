import { useState, type ReactNode } from 'react';
import { AlertContext } from './AlertContext';
import type { AlertType } from '../../components/Alert/Alert';

interface BooksProviderProps {
  children: ReactNode;
}

const BooksProvider = ({ children }: BooksProviderProps) => {
  const [alerts, setAlerts] = useState<AlertType[]>([]);

  return (
    <AlertContext.Provider value={{ alerts, setAlerts }}>
      {children}
    </AlertContext.Provider>
  );
};

export default BooksProvider;
