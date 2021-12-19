import React, { useState } from 'react';
import { FaAngleRight } from 'react-icons/fa';

const Sidebar = () => {
	const [channelToggle, setChannelToggle] = useState(false);
	const [msgToggle, setMsgToggle] = useState(false);
	return (
		<div className='w-64 bg-slate-900 h-full min-h-full text-white'>
			<div className='p-7 flex flex-col gap-2 items-center'>
				<h1 className='text-white text-center'>Slacker</h1>
				<div className='w-full'>
					<hr className='border-gray-100' />
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
					<div className='flex flex-col'>
						<div className='nav-button'>
							<span>Add Channel</span>
						</div>
					</div>
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
		</div>
	);
};

export default Sidebar;
