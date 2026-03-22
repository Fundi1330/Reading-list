import { useContext } from 'react';
import { UserContext } from '../context/User/UserProvider';

export const useUser = () => {
  return useContext(UserContext);
};
