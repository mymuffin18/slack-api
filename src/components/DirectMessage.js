import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { getUserMessages, sendMessage } from '../api/slack';
import { useAuth } from '../context/AuthContextProvider';
import { useUsers } from '../context/UsersContextProvider';

const DirectMessage = () => {
	const [email, setEmail] = useState('');
	const [toggleSearch, setToggleSearch] = useState(false);
	const [filteredEmails, setFilteredEmails] = useState([]);
	const [messages, setMessages] = useState([]);
	const [message, setMessage] = useState('');
	const [user, setUser] = useState({});
	const { state } = useAuth();
	const users = useUsers();
	const spanRef = useRef();

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

	useEffect(() => {
		if (!_.isEmpty(user)) {
			(async () => {
				const data = await getUserMessages(state.headers, user.id);
				console.log('data', data);
				setMessages((s) => data);
				console.log('messages', messages);
				spanRef.current.scrollIntoView({ behavior: 'smooth' });
			})();
		}
	}, [user]);

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
			setMessage('');
		}
	};
	return (
		<div className='h-full flex flex-col'>
			<div className='bg-red-300 h-16 flex justify-around items-center'>
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
						<ul className='bg-white border border-gray-100 mt-2 w-1/4 overflow-y-auto overflow-x-hidden flex flex-col items-center h-28 absolute top-12'>
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
			</div>
			<div className='bg-blue-300 chat-box overflow-y-auto'>
				<div className='flex flex-col gap-3 px-2'>
					{messages.map((msg, index) => (
						<div
							key={msg.id}
							className={`${
								msg.sender.id === state.user.id
									? 'self-end'
									: 'self-start'
							}`}
						>
							<span className='text-sm'>
								{msg.sender.email}
							</span>
							<div
								className='flex chat-bubble'
								ref={
									messages.length - 1 === index
										? spanRef
										: null
								}
							>
								{msg.body}
							</div>
						</div>
					))}
					<span ref={spanRef}></span>
				</div>
			</div>
			<form onSubmit={(e) => handleSubmit(e)}>
				<div className='bg-red-300 h-20 flex items-center justify-center gap-3'>
					<textarea
						name=''
						className='resize-none w-5/6 rounded-lg'
						value={message}
						onChange={(e) => setMessage(e.target.value)}
					></textarea>
					<button className='btn btn-primary' type='submit'>
						Send
					</button>
				</div>
			</form>
		</div>
	);
};

export default DirectMessage;
