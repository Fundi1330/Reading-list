import { useContext, useEffect } from 'react';
import { UserContext, type UserContextType } from '../context/User/UserContext';
import axios from 'axios';

export const useUser = () => {
  return useContext(UserContext);
};
