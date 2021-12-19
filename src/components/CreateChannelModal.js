import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { FaPlusSquare } from 'react-icons/fa';
import { getUsers } from '../api/slack';
import { useAuth } from '../context/AuthContextProvider';

const CreateChannelModal = () => {
	const [channelName, setChannelName] = useState('');
	const [toggleAddUser, setToggleAddUser] = useState(false);
	const [userList, setUserList] = useState([]);
	const [toggleUserList, setToggleUserList] = useState(false);
	const [filteredEmails, setFilteredEmails] = useState([]);
	const [search, setSearch] = useState('');
	const { state } = useAuth();
	useEffect(() => {
		(async () => {
			const data = await getUsers(state.headers);
			setUserList(data);
		})();
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
	return ReactDOM.createPortal(
		<div className='fixed h-full top-0 w-full flex items-center justify-center bg-darkish'>
			<div className='modal gap-2'>
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
						onClick={() => setToggleAddUser((t) => !t)}
					>
						<FaPlusSquare size={26} />
					</div>
				</div>
				{toggleAddUser && (
					<div className='overflow-y-auto'>
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
									stroke-linecap='round'
									stroke-linejoin='round'
									stroke-width='2'
									d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
								/>
							</svg>
						</div>
						{toggleUserList && (
							<ul class='bg-white border border-gray-100 w-full mt-2 '>
								{filteredEmails &&
									filteredEmails.map((user) => (
										<li class='pl-8 pr-2 py-1 border-b-2 border-gray-100 relative cursor-pointer hover:bg-yellow-50 hover:text-gray-900'>
											{user.email}
										</li>
									))}
							</ul>
						)}
					</div>
				)}
				<div>
					<button className='px-4 py-2 bg-blue-500 text-white cursor-pointer hover:bg-blue-400 transition-all'>
						Submit
					</button>
				</div>
			</div>
		</div>,
		document.getElementById('portal')
	);
};

export default CreateChannelModal;
