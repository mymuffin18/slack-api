import React, { useEffect, useState } from 'react';
import { createChannel, getUsers } from '../api/slack';
import { useAuth } from '../context/AuthContextProvider';
import { useChannels } from '../context/ChannelContextProvider';
import { FaPlusSquare } from 'react-icons/fa';
import { BsFillXCircleFill } from 'react-icons/bs';
import { GiHamburgerMenu } from 'react-icons/gi';
import { useNav } from '../context/NavContextProvider';

const CreateChannel = (props) => {
	const [channelName, setChannelName] = useState('');
	const [toggleAddUser, setToggleAddUser] = useState(false);
	const [userList, setUserList] = useState([]);
	const [toggleUserList, setToggleUserList] = useState(false);
	const [filteredEmails, setFilteredEmails] = useState([]);
	const [search, setSearch] = useState('');
	const { dispatch: navDispatch } = useNav();
	const [users, setUsers] = useState([]);
	const { state } = useAuth();
	const { dispatch: channelDispatch } = useChannels();
	useEffect(() => {
		(async () => {
			const data = await getUsers(state.headers);
			setUserList(data);
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (search === '') {
			setFilteredEmails(userList);
		} else {
			setFilteredEmails(
				userList.filter((user) => {
					return user.email
						.toLowerCase()
						.includes(search.toLowerCase());
				})
			);
		}
	}, [search, userList]);

	const handleAdd = (e, user) => {
		e.preventDefault();
		if (!users.some((u) => u === user)) {
			setUsers([...users, user]);
		}
		setToggleUserList((t) => !t);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const [data, errors] = await createChannel(
			users,
			channelName,
			state.headers
		);
		if (errors.length === 0) {
			alert('You created a new channel!');
			channelDispatch({ type: 'ADD_CHANNEL', payload: data });
		} else {
			alert(errors[0]);
		}
	};

	const handleFocus = () => {
		setToggleUserList((t) => !t);
	};

	const handleBlur = () => {
		setToggleUserList(false);
	};

	const handleOpenNav = () => {
		navDispatch({ type: 'OPEN_NAV' });
	};

	const toggleUser = (e) => {
		setToggleAddUser((toggle) => !toggle);
	};
	return (
		<div className='card h-full flex justify-center items-center '>
			<div
				style={{ color: 'white' }}
				className='absolute right-5 top-3 cursor-pointer lg:hidden'
				onClick={handleOpenNav}
			>
				<GiHamburgerMenu size={32} />
			</div>
			<div className='h-1/2 border w-6/12 flex flex-col gap-1 items-center overflow-y-auto container'>
				<div className='mt-5'>
					<h1 className='text-center title'>Create Channel</h1>
				</div>
				<div className='w-3/5'>
					<input
						type='text'
						className='input'
						placeholder='Channel Name'
						value={channelName}
						onChange={(e) =>
							setChannelName((c) => e.target.value)
						}
					/>
				</div>
				<div className='flex justify-between items-center w-1/2'>
					<span className='text-white font-semibold'>
						Add Members
					</span>
					<div
						style={{ color: 'green' }}
						className='cursor-pointer'
						onClick={(e) => toggleUser(e)}
					>
						<FaPlusSquare size={26} />
					</div>
				</div>
				{toggleAddUser && (
					<div className='flex flex-col items-center'>
						<div className='relative'>
							<input
								type='text'
								className='p-2 pl-8 rounded border border-gray-200 bg-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent'
								placeholder='search...'
								onFocus={handleFocus}
								// onBlur={handleBlur}
								value={search}
								onChange={(e) =>
									setSearch((s) => e.target.value)
								}
							/>
							<svg
								className='w-4 h-4 absolute left-2.5 top-3.5'
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth='2'
									d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
								/>
							</svg>
						</div>
						{toggleUserList && (
							<ul className='bg-white border h-36 border-gray-100 mt-2 w-full overflow-y-auto overflow-x-hidden flex flex-col items-center'>
								{filteredEmails &&
									filteredEmails.map((user) => (
										<li
											key={user.id}
											className='py-1 border-b-2 border-gray-100 relative cursor-pointer hover:bg-yellow-50 hover:text-gray-900'
											onClick={(e) =>
												handleAdd(e, user)
											}
										>
											{user.email}
										</li>
									))}
							</ul>
						)}
						<ul className='overflow-y-auto w-full'>
							{users &&
								users.map((user) => (
									<li
										key={user.id}
										className='py-5 w-full flex justify-between items-center'
									>
										<span className='text-white font-bold'>
											{user.email}
										</span>

										<div
											style={{ color: 'red' }}
											className='cursor-pointer'
											onClick={() =>
												setUsers(
													users.filter(
														(u) =>
															u.id !==
															user.id
													)
												)
											}
										>
											<BsFillXCircleFill />
										</div>
									</li>
								))}
						</ul>
					</div>
				)}

				<div className='flex justify-center gap-3 w-1/2'>
					<button
						className='btn btn-primary'
						onClick={(e) => handleSubmit(e)}
					>
						Submit
					</button>
				</div>
			</div>
		</div>
	);
};

export default CreateChannel;
