import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { getAllMessages, getUserMessages } from '../api/slack';
import { useAuth } from '../context/AuthContextProvider';
import Sidebar from './Sidebar';
import { useUsers } from '../context/UsersContextProvider';

function Dashboard() {
	return (
		// <div className='dashboard-height'>
		// 	<div className='grid grid-cols-12 p-3 gap-2'>
		// 		<div className='col-span-2 hidden sm:block'>
		// 			<Sidebar />
		// 		</div>
		// 		<div className='col-span-12 md:col-span-10'>
		// 			<Outlet />
		// 		</div>
		// 	</div>
		// </div>
		<div className='h-screen'>
			<div className='h-full p-3 grid grid-cols-12 gap-2'>
				<div className='hidden lg:col-span-2 lg:block'>
					<Sidebar />
				</div>
				<div className='col-span-12 lg:col-span-10'>
					<Outlet />
				</div>
			</div>
		</div>
	);
}

export default Dashboard;
