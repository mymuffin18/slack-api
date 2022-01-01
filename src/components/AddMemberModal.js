import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useUsers } from '../context/UsersContextProvider';
import _ from 'lodash';
import { addMemberChannel } from '../api/slack';
import { useAuth } from '../context/AuthContextProvider';

const AddMemberModal = ({ setToggleAddMemberModal, channelId }) => {
	const users = useUsers();
	const [toggleUserList, setToggleUserList] = useState(false);
	const [search, setSearch] = useState('');
	const [filteredEmails, setFilteredEmails] = useState([]);
	const [user, setUser] = useState({});
	const { state } = useAuth();

	const handleFocus = () => {
		setToggleUserList((t) => !t);
	};

	const handleAdd = (u) => {
		// u = userObject
		setUser((user) => u);
		setToggleUserList((t) => !t);
	};

	const handleRemoveUser = () => {
		setUser({});
	};

	const closeModal = () => {
		setToggleAddMemberModal((t) => !t);
	};

	const handleAddMember = async () => {
		if (_.isEmpty(user)) {
			alert('You need to add a member!');
		} else {
			const status = await addMemberChannel(
				state.headers,
				channelId,
				user.id
			);
			if (status === 200) {
				alert(`Added ${user.email}!`);
				setToggleAddMemberModal((t) => !t);
			}
		}
	};

	useEffect(() => {
		if (search === '') {
			setFilteredEmails(users);
		} else {
			setFilteredEmails(
				users.filter((user) => {
					return user.email
						.toLowerCase()
						.includes(search.toLowerCase());
				})
			);
		}
	}, [search, users]);

	return ReactDOM.createPortal(
		<div className='modal-bg bg-darkish'>
			<div className='card modal modal-size gap-2'>
				<div className='mt-5'>
					<h1 className='text-center'>Add Member</h1>
				</div>
				<div className='flex flex-col items-center'>
					<div className='relative'>
						<input
							type='text'
							className='p-2 pl-8 rounded border border-gray-200 bg-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent'
							placeholder='Search User...'
							onFocus={handleFocus}
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
										onClick={() =>
											handleAdd(user)
										}
									>
										{user.email}
									</li>
								))}
						</ul>
					)}
				</div>
				{!_.isEmpty(user) && (
					<div className='w-full flex justify-around items-center'>
						<div className='text-lg'>{user.email}</div>
						<div>
							<button
								className='btn btn-danger'
								onClick={handleRemoveUser}
							>
								Remove
							</button>
						</div>
					</div>
				)}

				<div className='flex justify-around gap-2'>
					<button
						className='btn btn-danger'
						onClick={closeModal}
					>
						Close
					</button>
					<button
						className='btn btn-primary'
						onClick={handleAddMember}
					>
						Add
					</button>
				</div>
			</div>
		</div>,
		document.getElementById('portal')
	);
};

export default AddMemberModal;
