import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { FaPlusSquare } from 'react-icons/fa';
import { createChannel, getUsers } from '../api/slack';
import { useAuth } from '../context/AuthContextProvider';
import { useChannels } from '../context/ChannelContextProvider';

const CreateChannelModal = (props) => {
	const [channelName, setChannelName] = useState('');
	const [toggleAddUser, setToggleAddUser] = useState(false);
	const [userList, setUserList] = useState([]);
	const [toggleUserList, setToggleUserList] = useState(false);
	const [filteredEmails, setFilteredEmails] = useState([]);
	const [search, setSearch] = useState('');

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
		setUsers([...users, user]);
		setToggleUserList((t) => !t);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const [data, status] = await createChannel(
			users,
			channelName,
			state.headers
		);
		if (status === 200) {
			alert('You created a new channel!');
			channelDispatch({ type: 'ADD_CHANNEL', payload: data });
			props.setToggleCreateModal((t) => !t);
		}
	};

	const toggleUser = (e) => {
		setToggleAddUser((toggle) => !toggle);
	};

	const handleClose = (e) => {
		e.preventDefault();
		props.setToggleCreateModal((t) => !t);
	};
	return ReactDOM.createPortal(
		<div className='modal-bg bg-darkish'>
			<div className='modal card gap-2'>
				<div className='mt-5'>
					<h1 className='text-center'>Create Channel</h1>
				</div>
				<div className='w-3/5'>
					<input
						type='text'
						className='border-2 py-1 w-full rounded-md text-lg'
						placeholder='Channel Name'
						value={channelName}
						onChange={(e) =>
							setChannelName((c) => e.target.value)
						}
					/>
				</div>
				<div className='flex justify-between items-center w-1/2'>
					<span>Add Members</span>
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
								onClick={() =>
									setToggleUserList((t) => !t)
								}
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
							<ul className='bg-white border border-gray-100 mt-2 w-full overflow-y-auto overflow-x-hidden flex flex-col items-center'>
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
										<span>{user.email}</span>
										<button
											className='px-4 py-1 bg-red-700 text-white hover:bg-red-500'
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
											Remove
										</button>
									</li>
								))}
						</ul>
					</div>
				)}

				<div className='flex justify-center gap-3 w-1/2'>
					<button
						onClick={(e) => handleClose(e)}
						className='btn btn-danger'
					>
						Close
					</button>
					<button
						className='btn btn-primary'
						onClick={(e) => handleSubmit(e)}
					>
						Submit
					</button>
				</div>
			</div>
		</div>,
		document.getElementById('portal')
	);
};

export default CreateChannelModal;
