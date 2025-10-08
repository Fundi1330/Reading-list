import { createContext } from 'react';

export interface CategoryIdsContextType {
  categoryIds: CategoryIds;
  setCategoryIds: Function;
}

export interface CategoryIds {
  plans: number;
  'in-process': number;
  finished: number;
}

export const CategoryIdsContext = createContext<CategoryIdsContextType>({
  categoryIds: {
    plans: 1,
    'in-process': 2,
    finished: 3,
  },
  setCategoryIds: () => {},
});
