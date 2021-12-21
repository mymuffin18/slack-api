import React from 'react';

import { useAuth } from '../context/AuthContextProvider';
import Sidebar from './Sidebar';

function Dashboard() {
	const { dispatch } = useAuth();
	const logoutHandler = (e) => {
		e.preventDefault();
		dispatch({ type: 'LOGOUT' });
	};

	return (
		<div className='h-screen grid grid-flow-col'>
			<div className='grid-cols-1'>
				<Sidebar />
			</div>
			<div className='grid-cols-11'>
				<h1>Dashboard</h1>
				<button
					className='px-4 py-2 bg-red-500 text-white'
					onClick={(e) => logoutHandler(e)}
				>
					Logout
				</button>
			</div>
		</div>
	);
}

export default Dashboard;
