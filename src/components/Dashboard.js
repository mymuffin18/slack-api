import React from 'react';
import { Outlet } from 'react-router-dom';

import Sidebar from './Sidebar';

function Dashboard() {
	return (
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
