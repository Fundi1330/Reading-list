import { useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { auth } from '../../firebase';
import type { User } from 'firebase/auth';

import { createContext } from 'react';

export interface UserContextType {
  user: User | null;
  setUser: Function;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => { },
});


interface UserProviderProps {
  children: ReactNode;
}

const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) navigate('/auth/sign-in/');
    setUser(auth.currentUser);
  }, []);

  return (
    <UserContext.Provider value={{ user: user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
