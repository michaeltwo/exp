import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom'; // 使用 Outlet 渲染子路由
import { Center, Spinner } from '@chakra-ui/react';
import AuthContext from '../context/AuthContext';

const ProtectedRoute = ({ requireConsent = true }) => {
  const { user, loading } = useContext(AuthContext);
  const hasConsent = localStorage.getItem('consentGiven') === 'true';
  
  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (requireConsent && !hasConsent) {
    return <Navigate to="/consent" />;
  }
  
  return <Outlet />; // 使用 Outlet 渲染子路由
};

export default ProtectedRoute;