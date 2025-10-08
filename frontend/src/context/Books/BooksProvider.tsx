import { useState, type ReactNode } from 'react';
import {
  PlansContext,
  InProcessContext,
  FinishedContext,
} from './BooksContext';
import type { BookType } from '../../components/Book/Book';

interface BooksProviderProps {
  children: ReactNode;
}

const BooksProvider = ({ children }: BooksProviderProps) => {
  const [plans, setPlans] = useState<BookType[]>([]);
  const [inProcess, setInProcess] = useState<BookType[]>([]);
  const [finished, setFinished] = useState<BookType[]>([]);

  return (
    <PlansContext.Provider value={{ plans, setPlans }}>
      <InProcessContext.Provider value={{ inProcess, setInProcess }}>
        <FinishedContext.Provider value={{ finished, setFinished }}>
          {children}
        </FinishedContext.Provider>
      </InProcessContext.Provider>
    </PlansContext.Provider>
  );
};

export default BooksProvider;
