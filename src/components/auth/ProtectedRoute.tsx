import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isAuthenticated, token } = useSelector((state: RootState) => state.auth);
    const location = useLocation();

    // Check both state and localStorage for persistence
    const hasToken = token || localStorage.getItem('adminAccessToken');

    if (!isAuthenticated && !hasToken) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};
