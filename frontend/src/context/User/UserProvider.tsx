import { useEffect, useMemo, type ReactNode } from 'react';
import { UserContext, type UserType } from './UserContext';
import axios from 'axios';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useNavigate } from 'react-router';

interface UserProviderProps {
  children: ReactNode;
}

const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useLocalStorage({
    keyName: 'user',
    defaultValue: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_BACKEND_URL + '/current-user', {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res);
        if (res.data.username == null || res.data.username == '') return;

        setUser(res.data);
      })
      .catch(() => navigate('/auth/sign-in/'));
  }, []);

  const value: UserType = useMemo(() => user, [user]);

  return (
    <UserContext.Provider value={{ user: value, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
