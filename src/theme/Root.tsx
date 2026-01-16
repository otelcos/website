import React, { useState, useEffect } from 'react';
import PasswordGate from '../components/PasswordGate';

interface RootProps {
  children: React.ReactNode;
}

export default function Root({ children }: RootProps): JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const authStatus = sessionStorage.getItem('opentelco-auth');
    setIsAuthenticated(authStatus === 'true');
  }, []);

  // Show nothing while checking auth status (prevents flash)
  if (isAuthenticated === null) {
    return <></>;
  }

  if (!isAuthenticated) {
    return <PasswordGate onSuccess={() => setIsAuthenticated(true)} />;
  }

  return <>{children}</>;
}
