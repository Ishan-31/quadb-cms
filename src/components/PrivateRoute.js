import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const PrivateRoute = ({ children }) => {
  const { authenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!authenticated) {
        router.push('/login');
      }
    }
  }, [authenticated]);

  if (!authenticated) {
    return null;
  }

  return <>{children}</>;
};

export default PrivateRoute;
