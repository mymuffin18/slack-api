import React, { useEffect, useState } from 'react';
import { createChannel, getUsers } from '../api/slack';
import { useAuth } from '../context/AuthContextProvider';
import { useChannels } from '../context/ChannelContextProvider';
import { FaPlusSquare } from 'react-icons/fa';
import { BsFillXCircleFill } from 'react-icons/bs';
import { GiHamburgerMenu } from 'react-icons/gi';
import { useNav } from '../context/NavContextProvider';
import { TailSpin, Puff } from 'svg-loaders-react';
import { useNotifications } from '../context/NotificationContextProvider';
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
	const [loading, setLoading] = useState(false);
	const [btnLoading, setBtnLoading] = useState(false);
	const { dispatch: notify } = useNotifications();
	useEffect(() => {
		(async () => {
			setLoading(true);
			const data = await getUsers(state.headers);
			setUserList(data);
			setLoading(false);
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

		setBtnLoading(true);
		const [data, errors] = await createChannel(
			users,
			channelName,
			state.headers
		);

		if (errors.length === 0) {
			channelDispatch({ type: 'ADD_CHANNEL', payload: data });
			notify({
				type: 'ADD_NOTIFICATION',
				payload: {
					type: 'SUCCESS',
					message: 'Channel Created!',
					title: 'Successful Response',
				},
			});
			setBtnLoading(false);
		} else {
			notify({
				type: 'ADD_NOTIFICATION',
				payload: {
					type: 'ERROR',
					message: errors[0],
					title: 'Error!',
				},
			});

			setBtnLoading(false);
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

			<div className='h-1/2 border w-4/5 flex flex-col gap-1 items-center overflow-y-hidden container lg:w-1/2'>
				{loading ? (
					<div className='h-full flex items-center'>
						<div>
							<TailSpin />
						</div>
					</div>
				) : (
					<>
						<div className='mt-5'>
							<h1 className='text-center title'>
								Create Channel
							</h1>
							<div className=''>
								<input
									type='text'
									className='input'
									placeholder='Channel Name'
									value={channelName}
									onChange={(e) =>
										setChannelName(
											(c) => e.target.value
										)
									}
								/>
							</div>
						</div>
						<div className='flex flex-col  items-center gap-2 w-full add-member-height overflow-y-auto'>
							<div className='flex justify-center w-1/2'>
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
												setSearch(
													(s) =>
														e.target
															.value
												)
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
										<ul className=' bg-white border h-36 border-gray-100 mt-2 w-full overflow-y-auto overflow-x-hidden flex flex-col items-center'>
											{filteredEmails &&
												filteredEmails.map(
													(user) => (
														<li
															key={
																user.id
															}
															className='py-1 border-b-2 border-gray-100 relative cursor-pointer hover:bg-yellow-50 hover:text-gray-900'
															onClick={(
																e
															) =>
																handleAdd(
																	e,
																	user
																)
															}
														>
															{
																user.email
															}
														</li>
													)
												)}
										</ul>
									)}
									<ul className='overflow-y-auto w-full'>
										{users &&
											users.map((user) => (
												<li
													key={user.id}
													className='py-1 w-full flex justify-between items-center'
												>
													<span className='text-white font-bold'>
														{
															user.email
														}
													</span>

													<div
														style={{
															color: 'red',
														}}
														className='cursor-pointer'
														onClick={() =>
															setUsers(
																users.filter(
																	(
																		u
																	) =>
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
						</div>

						<div className='flex justify-center gap-3 w-1/2'>
							<button
								className={`btn btn-primary ${
									btnLoading
										? 'hover:cursor-wait'
										: ''
								}`}
								onClick={(e) => handleSubmit(e)}
								disabled={btnLoading}
							>
								{btnLoading ? (
									<div className='flex justify-around items-center gap-2 h-6'>
										<Puff />
										Wait
									</div>
								) : (
									<span>Login</span>
								)}
							</button>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default CreateChannel;
