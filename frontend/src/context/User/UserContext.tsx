import { createContext } from 'react';
import type { BookType } from '../../components/Book/Book';

interface UserProps {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  books: BookType[];
}

export interface UserContextType {
  user: UserProps | null;
  setUser: Function;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

export type { UserProps as UserType };
