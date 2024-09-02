import React from 'react';
import { Navigate } from 'react-router-dom';

const IsLoggedin = ({ element: Element, ...rest }) => {
  const isAuthenticated = !!sessionStorage.getItem('sessionToken');

  // Redirect authenticated users away from login/register pages
  const redirectPath = rest.redirectPath || '/';

  return isAuthenticated ? <Navigate to={redirectPath} replace /> : <Element {...rest} />;
};

export default IsLoggedin;
