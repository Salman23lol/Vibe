import React, { useState, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { usersURI } from '../api'; 
import Loading from '../Component/Loading/Loading';

const AuthCheck = ({ element: Element, ...rest }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null: loading, true: authenticated, false: not authenticated
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      try {
        const token = sessionStorage.getItem('sessionToken');
        if (!token) {
          setIsAuthenticated(false);
          return;
        }

        const response = await usersURI.post("/validate-token", { token });

        if (response.status === 200) {
          setIsAuthenticated(true);
        } else {
          sessionStorage.clear();
          setIsAuthenticated(false);
          navigate("/", { replace: true });
        }
      } catch (error) {
        console.error("Error validating token:", error);
        sessionStorage.clear();
        setIsAuthenticated(false);
        navigate("/", { replace: true });
      }
    };

    validateToken();
  }, [navigate]);

  if (isAuthenticated === null) {
    return <Loading />;
  }

  return isAuthenticated ? (
    <Element {...rest} />
  ) : (
    <Navigate to="/auth/login" state={{ from: location }} replace />
  );
};

export default AuthCheck;
