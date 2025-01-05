import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../App';
import LoadingSpinner from './LoadingSpinner';

const withProtectedRoute = (WrappedComponent) => {
  return function ProtectedRouteWrapper(props) {
    const { authState } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
      if (!authState.isAuthenticated && !authState.loading) {
        navigate('/sign-in');
      }
    }, [authState.isAuthenticated, authState.loading, navigate]);

    if (authState.loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <LoadingSpinner size="large" />
        </div>
      );
    }

    return authState.isAuthenticated ? <WrappedComponent {...props} /> : null;
  };
};

export default withProtectedRoute;
