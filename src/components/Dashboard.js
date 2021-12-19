import React, { useEffect } from 'react';
import { getChannels } from '../api/slack';
import { useAuth } from '../context/AuthContextProvider';
import Sidebar from './Sidebar';
import CreateChannelModal from './CreateChannelModal';

function Dashboard() {
	const { state, dispatch } = useAuth();
	const logoutHandler = (e) => {
		e.preventDefault();
		dispatch({ type: 'LOGOUT' });
	};

	useEffect(() => {
		getChannels(state.headers);
	}, [state.headers]);
	return (
		<div className='h-screen grid grid-flow-col'>
			<div className='grid-cols-1'>
				<Sidebar />
			</div>
			<div className='grid-cols-9'>
				<h1>Dashboard</h1>
				<button
					className='px-4 py-2 bg-red-500 text-white'
					onClick={(e) => logoutHandler(e)}
				>
					Logout
				</button>
			</div>
			<CreateChannelModal />
		</div>
	);
}

export default Dashboard;
