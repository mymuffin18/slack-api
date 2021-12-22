import React, { useState } from 'react';
import { FaAngleRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContextProvider';

import { useChannels } from '../context/ChannelContextProvider';
import CreateChannelModal from './CreateChannelModal';

const Sidebar = () => {
	const [channelToggle, setChannelToggle] = useState(false);
	const [msgToggle, setMsgToggle] = useState(false);
	const [toggleCreateModal, setToggleCreateModal] = useState(false);

	const { dispatch } = useAuth();
	const logoutHandler = (e) => {
		e.preventDefault();
		dispatch({ type: 'LOGOUT' });
	};

	const { state: channelState } = useChannels();
	const openModal = (e) => {
		e.preventDefault();
		setToggleCreateModal((t) => !t);
	};

	return (
		<div className=' bg-slate-900 h-full min-h-full text-white'>
			<div className='p-7 flex flex-col gap-2 items-center'>
				<h1 className='text-white text-center'>Slacker</h1>
				<div className='w-full'>
					<hr className='border-gray-100' />
				</div>

				<div className='flex flex-col'>
					<button
						className='nav-button'
						onClick={(e) => openModal(e)}
					>
						Add Channel
					</button>
				</div>
				{/* DROPDOWN */}
				<div
					className='text-white mt-2 flex justify-between w-10/12 cursor-pointer items-center'
					onClick={() => setChannelToggle((t) => !t)}
				>
					<div>
						<span className='text-sm'>Channels</span>
					</div>
					<div
						className={`${
							channelToggle ? 'rotate-90' : ''
						} transition-transform p-2 hover:bg-slate-500`}
					>
						<FaAngleRight />
					</div>
				</div>
				{channelToggle && (
					<ul className='flex flex-col'>
						{channelState.channels.map((channel) => (
							<li key={channel.id}>
								<Link
									to={`/dashboard/channels/${channel.id}`}
								>
									{channel.name}
								</Link>
							</li>
						))}
					</ul>
				)}
				{toggleCreateModal && (
					<CreateChannelModal
						setToggleCreateModal={setToggleCreateModal}
					/>
				)}

				<div
					className='text-white mt-2 flex justify-between w-10/12 cursor-pointer'
					onClick={() => setMsgToggle((t) => !t)}
				>
					<div>
						<span className='text-sm'>Direct Messages</span>
					</div>
					<div
						className={`${
							msgToggle ? 'rotate-90' : ''
						} transition-all`}
					>
						<FaAngleRight />
					</div>
				</div>
			</div>
			<div className='flex flex-col justify'>
				<button
					className='px-4 py-2 bg-red-500 text-white'
					onClick={(e) => logoutHandler(e)}
				>
					Logout
				</button>
			</div>
		</div>
	);
};

export default Sidebar;
