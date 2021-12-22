import React from 'react';
import { Outlet } from 'react-router-dom';

import Sidebar from './Sidebar';

function Dashboard() {
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
