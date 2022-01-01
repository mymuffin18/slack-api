import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import { fetcher, getUser, sendMessage } from '../api/slack';
import { API_URL } from '../api/url';
import { useAuth } from '../context/AuthContextProvider';
import { useUsers } from '../context/UsersContextProvider';
import _ from 'lodash';
const Messages = () => {
	const params = useParams();
	const { state } = useAuth();
	const [user, setUser] = useState({});
	const users = useUsers();
	const [message, setMessage] = useState('');
	const spanRef = useRef();
	const inputRef = useRef();

	// useEffect(() => {
	// 	(async () => {
	// 		const data = await getChannelDetail(state.headers, params.id);
	// 		setChannelData(data);
	// 	})();
	// 	inputRef.current.focus();
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [params.id, state.headers]);

	const { data: messages, error } = useSWR(
		[
			`${API_URL}/messages?receiver_id=${params.id}&receiver_class=User`,
			state.headers,
		],
		fetcher,
		{ refreshInterval: 1000 }
	);

	useEffect(() => {
		let mounted = true;
		if (mounted) {
			spanRef.current.scrollIntoView({
				// behavior: 'smooth',
			});
		}

		return () => (mounted = false);
	}, [messages]);

	useEffect(() => {
		(async () => {
			const u = await getUser(users, params.id);
			setUser(u);
		})();
	}, [params.id, users]);

	const handleSend = async (e) => {
		e.preventDefault();
		if (message === '') {
			alert('nah');
		} else {
			await sendMessage(state.headers, params.id, 'User', message);
			setMessage('');
		}
	};
	return (
		<>
			<div className='card h-full flex flex-col'>
				<div className=' h-16 flex justify-around items-center'>
					{!_.isEmpty(user) && (
						<span className='text-lg text-white font-bold'>
							{user.email}
						</span>
					)}
				</div>
				<div className=' chat-box overflow-y-auto'>
					<div className='flex flex-col gap-3 px-2'>
						{messages &&
							messages.map((msg, index) => (
								<div
									key={msg.id}
									className={`${
										msg.sender.id ===
										state.user.id
											? 'self-end'
											: 'self-start'
									}`}
								>
									<span className='text-sm'>
										{msg.sender.email ===
										state.user.email ? (
											<span>You</span>
										) : (
											<span>
												{msg.sender.email}
											</span>
										)}
									</span>
									<div className='flex chat-bubble'>
										{msg.body}
									</div>
								</div>
							))}
						<span ref={spanRef}></span>
					</div>
				</div>
				<form onSubmit={(e) => handleSend(e)}>
					<div className='h-20 flex items-center justify-center gap-3'>
						<textarea
							name=''
							className='resize-none w-5/6 rounded-lg'
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							ref={inputRef}
						></textarea>
						<button className='btn btn-primary' type='submit'>
							Send
						</button>
					</div>
				</form>
			</div>
		</>
	);
};

export default Messages;
