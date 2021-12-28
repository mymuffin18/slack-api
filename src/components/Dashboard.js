import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { getAllMessages, getUserMessages } from '../api/slack';
import { useAuth } from '../context/AuthContextProvider';
import Sidebar from './Sidebar';
import { useUsers } from '../context/UsersContextProvider';

function Dashboard() {
	return (
		<div className='h-screen background grid grid-cols-12 p-4'>
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
