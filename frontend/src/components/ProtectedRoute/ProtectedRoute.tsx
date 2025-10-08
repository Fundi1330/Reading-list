import type { ReactNode } from 'react';
import { useUser } from '../../hooks/useUser';
import { Navigate } from 'react-router';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useUser();

  if (!user) return <Navigate to='/auth/sign-in/' />;
  return children;
};

export default ProtectedRoute;
