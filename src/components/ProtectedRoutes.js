import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContextProvider';

function ProtectedRoutes(props) {
	const { state } = useAuth();
	if (!state.login) {
		return <Navigate to='/' />;
	}
	return props.children;
}

export default ProtectedRoutes;
