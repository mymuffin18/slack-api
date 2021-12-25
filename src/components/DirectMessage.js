import React, { useEffect, useState } from 'react';
import { sendMessage } from '../api/slack';
import { useAuth } from '../context/AuthContextProvider';
import { useUsers } from '../context/UsersContextProvider';

const DirectMessage = () => {
	const [email, setEmail] = useState('');
	const [toggleSearch, setToggleSearch] = useState(false);
	const [filteredEmails, setFilteredEmails] = useState([]);
	const [message, setMessage] = useState('');
	const [user, setUser] = useState({});
	const { state } = useAuth();
	const users = useUsers();

	useEffect(() => {
		if (email === '') {
			setToggleSearch(false);
		} else {
			setToggleSearch(true);
			setFilteredEmails(
				users.filter((user) => {
					return user.email
						.toLowerCase()
						.includes(email.toLowerCase());
				})
			);
		}
	}, [users, email]);

	const handleSet = (u) => {
		setToggleSearch(false);
		setEmail(u.email);
		setUser(u);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (email === '' && message === '') {
			alert('Please enter an email or message');
		} else {
			await sendMessage(state.headers, user.id, 'User', message);
			setEmail('');
			setUser('');
			setMessage('');
		}
	};
	return (
		<div className='h-full flex justify-center items-center bg-gray-500'>
			<div className='modal gap-5'>
				<div className='mt-5'>Send Message</div>
				<form
					className='flex flex-col gap-3'
					onSubmit={(e) => handleSubmit(e)}
				>
					<div className='flex flex-col items-center'>
						<div className='relative'>
							<input
								type='text'
								className='p-2 rounded border border-gray-200 bg-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent'
								placeholder='Email..'
								// onFocus={handleFocus}
								value={email}
								onChange={(e) =>
									setEmail((s) => e.target.value)
								}
							/>
						</div>
						{toggleSearch && (
							<ul className='bg-white border border-gray-100 mt-2 w-full overflow-y-auto overflow-x-hidden flex flex-col items-center'>
								{filteredEmails &&
									filteredEmails.map((user) => (
										<li
											key={user.id}
											className='py-1 border-b-2 border-gray-100 relative cursor-pointer hover:bg-yellow-50 hover:text-gray-900'
											onClick={() =>
												handleSet(user)
											}
										>
											{user.email}
										</li>
									))}
							</ul>
						)}
					</div>
					<div>
						<textarea
							className='border-gray-200 bg-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent resize-none w-full h-32'
							placeholder='Enter message...'
							value={message}
							onChange={(e) =>
								setMessage((m) => e.target.value)
							}
						></textarea>
					</div>
					<div className='flex justify-center'>
						<button type='submit' className='btn btn-primary'>
							Send
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default DirectMessage;
