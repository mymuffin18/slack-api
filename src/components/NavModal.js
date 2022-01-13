import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { FaAngleRight, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContextProvider';
import { useChannels } from '../context/ChannelContextProvider';
import { useNav } from '../context/NavContextProvider';
import { useUsers } from '../context/UsersContextProvider';
import CustomLink from './CustomLink';
const NavModal = () => {
	const [channelToggle, setChannelToggle] = useState(false);
	const [msgToggle, setMsgToggle] = useState(false);
	const users = useUsers();
	const [search, setSearch] = useState('');
	const [filteredNames, setFilteredNames] = useState([]);
	const { dispatch: navDispatch } = useNav();
	const { state, dispatch } = useAuth();
	const logoutHandler = () => {
		dispatch({ type: 'LOGOUT' });
		handleCloseNav();
	};

	const { state: channelState } = useChannels();

	useEffect(() => {
		if (search === '') {
			setFilteredNames(users);
		} else {
			setFilteredNames(
				users.filter((user) => {
					return user.email.toLowerCase().includes(search);
				})
			);
		}
	}, [search, users]);

	const handleCloseNav = () => {
		navDispatch({ type: 'CLOSE_NAV' });
	};
	return ReactDOM.createPortal(
		<div className='modal-bg bg-darkish'>
			<div
				className='absolute top-3 right-5 cursor-pointer'
				onClick={handleCloseNav}
			>
				<FaTimes size={32} />
			</div>
			<div className='card-modal w-1/2 h-5/6 overflow-y-auto flex flex-col justify-between'>
				<div className='p-3 flex flex-col gap-2 items-center overflow-y-auto sidebar-container-div'>
					<div>
						<span className='text-lg'>
							{state.user.email}
						</span>
					</div>
					<div className='w-full'>
						<hr className='border-gray-100' />
					</div>
					<div className='flex flex-col w-full'>
						<CustomLink to='' onClick={() => handleCloseNav}>
							Create Channel
						</CustomLink>
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
						<ul className='dropdown-list h-40'>
							{channelState.channels.map((channel) => (
								<div>
									<li
										key={channel.id}
										className='w-full flex justify-center'
									>
										<CustomLink
											to={`/dashboard/channels/${channel.id}`}
											onClick={() =>
												handleCloseNav
											}
										>
											{channel.name}
										</CustomLink>
									</li>
								</div>
							))}
						</ul>
					)}

					<div
						className='text-white mt-2 flex justify-between w-10/12 cursor-pointer'
						onClick={() => setMsgToggle((t) => !t)}
					>
						<div>
							<span className='text-sm'>
								Direct Messages
							</span>
						</div>
						<div
							className={`${
								msgToggle ? 'rotate-90' : ''
							} transition-transform p-2 hover:bg-slate-500`}
						>
							<FaAngleRight />
						</div>
					</div>
					{msgToggle && (
						<ul className='dropdown-list h-52'>
							<input
								type='text'
								value={search}
								onChange={(e) =>
									setSearch(e.target.value)
								}
								placeholder='Search...'
								className='input'
							/>
							{filteredNames.map((user) => (
								<li
									key={user.id}
									className='w-full flex justify-center'
								>
									<CustomLink
										to={`/dashboard/messages/${user.id}`}
										onClick={() => handleCloseNav}
									>
										{user.email}
									</CustomLink>
								</li>
							))}
						</ul>
					)}
					{/* <div className='flex flex-col'>
					<Link to='/dashboard/messages/'>Send Message</Link>
				</div> */}
				</div>
				<div className='flex flex-col justify-end w-full p-2'>
					<button
						className='btn btn-danger'
						onClick={logoutHandler}
					>
						Logout
					</button>
				</div>
			</div>
		</div>,
		document.getElementById('portal')
	);
};

export default NavModal;
