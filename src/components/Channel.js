import React, { useEffect, useState, useRef } from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ReactMde from 'react-mde';
import useSWR from 'swr';
import {
	fetcher,
	getChannelDetail,
	getChannelMessages,
	sendMessage,
} from '../api/slack';
import { API_URL } from '../api/url';
import { useAuth } from '../context/AuthContextProvider';
import { useNav } from '../context/NavContextProvider';
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
	const { handleOpenNav } = useNav();
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
			return (
				<span className='text-sm font-extralight text-bravery-purple'>
					today
				</span>
			);
		} else {
			return (
				<span className='text-sm font-extralight text-bravery-purple'>
					{`${
						d.getUTCMonth() + 1
					}/${d.getUTCDate()}/${d.getFullYear()}`}
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
							Add member
						</button>
					</div>
					<div
						style={{ color: 'white' }}
						className='cursor-pointer lg:hidden'
						onClick={handleOpenNav}
					>
						<GiHamburgerMenu size={32} />
					</div>
				</div>
				<div className='chat-box overflow-y-auto'>
					<div className='flex flex-col gap-3 px-4'>
						{messages &&
							messages.map((msg, index) => (
								<div
									key={msg.id}
									// className={`${
									// 	msg.sender.id ===
									// 	state.user.id
									// 		? 'self-end'
									// 		: 'self-start'
									// }`}
								>
									<div className='flex gap-2 items-end text-white'>
										<div className='h-10'>
											<img
												src='https://www.minervastrategies.com/wp-content/uploads/2016/03/default-avatar.jpg'
												alt=''
												className='h-full rounded-full'
											/>
										</div>
										<div>
											<span className='text-lg text-brilliance-coral'>
												{msg.sender
													.email ===
												state.user.email ? (
													<span>
														You
													</span>
												) : (
													<span>
														{
															msg
																.sender
																.email
														}
													</span>
												)}
											</span>
										</div>
										<div>
											{getDay(msg.created_at)}
										</div>
									</div>

									<div className=' chat-bubble word-break text-white'>
										<div className='mr-3'>
											<ReactMarkdown
												remarkPlugins={[
													remarkGfm,
												]}
											>
												{msg.body}
											</ReactMarkdown>
										</div>
									</div>
								</div>
							))}
						<span ref={spanRef}></span>
					</div>
				</div>
				<form onSubmit={(e) => handleSend(e)}>
					<div className='h-20 flex items-center justify-center gap-3 px-3'>
						<textarea
							name=''
							className='resize-none w-5/6 rounded-lg p-2'
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
