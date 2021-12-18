import React from 'react';
import { useAuth } from '../context/AuthContextProvider';

function Dashboard() {
	const { dispatch } = useAuth();
	const logoutHandler = (e) => {
		e.preventDefault();
		dispatch({ type: 'LOGOUT' });
	};
	return (
		<div>
			<h1>Dashboard</h1>
			<button
				className='px-4 py-2 bg-red-500 text-white'
				onClick={(e) => logoutHandler(e)}
			>
				Logout
			</button>
		</div>
	);
}

export default Dashboard;
