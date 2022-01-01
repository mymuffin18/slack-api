import { getByDisplayValue } from '@testing-library/react';
import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import {
	fetcher,
	getChannelDetail,
	getChannelMessages,
	sendMessage,
} from '../api/slack';
import { API_URL } from '../api/url';
import { useAuth } from '../context/AuthContextProvider';
import { useUsers } from '../context/UsersContextProvider';
import AddMemberModal from './AddMemberModal';
import ChannelMemberModal from './ChannelMemberModal';

const Channel = () => {
	const params = useParams();
	const { state } = useAuth();
	const [channelData, setChannelData] = useState({});
	const [toggleAddMemberModal, setToggleAddMemberModal] = useState(false);
	const [toggleChannelMemberModal, setToggleChannelMemberModal] =
		useState(false);
	const users = useUsers();
	const [message, setMessage] = useState('');

	let spanRef = useRef();
	const inputRef = useRef();

	useEffect(() => {
		(async () => {
			const data = await getChannelDetail(state.headers, params.id);
			setChannelData(data);
		})();
		inputRef.current.focus();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [params.id, state.headers]);

	let { data: messages, error } = useSWR(
		[
			`${API_URL}/messages?receiver_id=${params.id}&receiver_class=Channel`,
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

	const toggleAddMember = () => {
		// toggles Add member modal
		setToggleAddMemberModal((t) => !t);
	};

	const toggleMember = () => {
		// toggles Member modal
		setToggleChannelMemberModal((t) => !t);
	};

	const getDay = (date) => {
		const d = new Date(date);
		const today = new Date();
		if (d.getDate() === today.getDate()) {
			return <span className='text-sm font-bold'>today</span>;
		} else {
			return (
				<span className='text-sm font-bold'>
					{d.toDateString()}
				</span>
			);
		}
	};

	const getMembers = () => {
		let arr = [];
		const channelMembers = channelData.channel_members;
		for (let i = 0; i < channelData.channel_members.length; i++) {
			users.forEach((user) => {
				if (user.id === channelMembers[i].user_id) {
					arr.push(user);
				}
			});
		}

		return arr;
	};

	const handleSend = async (e) => {
		e.preventDefault();
		if (message === '') {
			alert('nah');
		} else {
			await sendMessage(
				state.headers,
				channelData.id,
				'Channel',
				message
			);
			setMessage('');
		}
	};
	return (
		<>
			<div className='card h-full flex flex-col'>
				<div className='h-16 flex justify-around items-center'>
					<div>
						<button
							className='btn btn-primary'
							onClick={toggleMember}
						>
							Members
						</button>
					</div>
					<div className='text-white font-bold text-lg'>
						{channelData.name}
					</div>
					<div>
						<button
							className='btn btn-primary'
							onClick={toggleAddMember}
						>
							add member
						</button>
					</div>
				</div>
				<div className='chat-box overflow-y-auto'>
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
									<div className='flex justify-around gap-2 items-center text-white'>
										{getDay(msg.created_at)}
										<span className='text-sm'>
											{msg.sender.email ===
											state.user.email ? (
												<span>You</span>
											) : (
												<span>
													{
														msg.sender
															.email
													}
												</span>
											)}
										</span>
									</div>
									<div
										className='flex chat-bubble'
										// 	ref={
										// 		// messages.length - 1 ===
										// 		// index
										// 		// 	? spanRef
										// 		// 	: null
										// 	}
									>
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

			{toggleAddMemberModal && (
				<AddMemberModal
					setToggleAddMemberModal={setToggleAddMemberModal}
					channelId={params.id}
				/>
			)}
			{toggleChannelMemberModal && (
				<ChannelMemberModal
					getMembers={getMembers}
					setToggleChannelMemberModal={
						setToggleChannelMemberModal
					}
				/>
			)}
		</>
	);
};

export default Channel;
