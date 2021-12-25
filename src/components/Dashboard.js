import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { getUserMessages } from '../api/slack';
import { useAuth } from '../context/AuthContextProvider';
import Sidebar from './Sidebar';

function Dashboard() {
	const { state } = useAuth();
	useEffect(() => {
		(async () => {
			await getUserMessages(state.headers, state.id);
		})();
	}, []);
	return (
		<div className='h-screen grid grid-cols-12'>
			<div className='col-span-2 hidden sm:block'>
				<Sidebar />
			</div>
			<div className='col-span-12 md:col-span-10'>
				<Outlet />
			</div>
		</div>
	);
}

export default Dashboard;
