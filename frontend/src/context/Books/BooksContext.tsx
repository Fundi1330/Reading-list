import { createContext } from 'react';
import type { BookType } from '../../components/Book/Book';

export interface PlansContextType {
  plans: BookType[];
  setPlans: Function;
}

export interface InProgerssContextType {
  inProcess: BookType[];
  setInProcess: Function;
}

export interface FinishedContextType {
  finished: BookType[];
  setFinished: Function;
}

export const PlansContext = createContext<PlansContextType>({
  plans: [],
  setPlans: () => {},
});

export const InProcessContext = createContext<InProgerssContextType>({
  inProcess: [],
  setInProcess: () => {},
});

export const FinishedContext = createContext<FinishedContextType>({
  finished: [],
  setFinished: () => {},
});
