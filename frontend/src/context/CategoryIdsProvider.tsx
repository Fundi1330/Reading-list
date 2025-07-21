import { useState, type ReactNode } from 'react';
import { CategoryIdsContext, type CategoryIds } from './CategoryIdsContext';

interface CategoryIdsProviderProps {
  children: ReactNode;
}

const CategoryIdsProvider = ({ children }: CategoryIdsProviderProps) => {
  const [categoryIds, setCategoryIds] = useState<CategoryIds>({
    plans: 1,
    'in-process': 2,
    finished: 3,
  });

  return (
    <CategoryIdsContext.Provider value={{ categoryIds, setCategoryIds }}>
      {children}
    </CategoryIdsContext.Provider>
  );
};

export default CategoryIdsProvider;
