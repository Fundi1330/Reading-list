import { useContext } from 'react';
import type { BookType } from '../components/Book/Book';
import {
  FinishedContext,
  InProcessContext,
  PlansContext,
  type FinishedContextType,
  type InProgerssContextType,
  type PlansContextType,
} from '../context/Books/BooksContext';

export const useBookListByCategory = () => {
  const { plans, setPlans } = useContext<PlansContextType>(PlansContext);
  const { inProcess, setInProcess } =
    useContext<InProgerssContextType>(InProcessContext);
  const { finished, setFinished } =
    useContext<FinishedContextType>(FinishedContext);

  const getBookListByCategory = (category: BookType['category']) => {
    if (category === 'plans') return plans;
    if (category === 'in-process') return inProcess;
    return finished;
  };

  const getBookListSetterByCategory = (category: BookType['category']) => {
    if (category === 'plans') return setPlans;
    if (category === 'in-process') return setInProcess;
    return setFinished;
  };
  return { getBookListByCategory, getBookListSetterByCategory };
};
