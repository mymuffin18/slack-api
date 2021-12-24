import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
	getChannelDetail,
	getChannelMessages,
	sendMessage,
} from '../api/slack';
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
	const [messages, setMessages] = useState([]);
	const spanRef = useRef();

	useEffect(() => {
		(async () => {
			const data = await getChannelDetail(state.headers, params.id);
			setChannelData(data);
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [params.id]);

	useEffect(() => {
		(async () => {
			const msgs = await getChannelMessages(state.headers, params.id);
			setMessages(msgs);
			spanRef.current.scrollIntoView({ behavior: 'smooth' });
		})();
	}, [params.id]);

	const toggleAddMember = () => {
		// toggles Add member modal
		setToggleAddMemberModal((t) => !t);
	};

	const toggleMember = () => {
		// toggles Member modal
		setToggleChannelMemberModal((t) => !t);
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
			<div className='h-full flex flex-col'>
				<div className='bg-red-300 h-16 flex justify-around items-center'>
					<div>
						<button
							className='btn btn-primary'
							onClick={toggleMember}
						>
							Members
						</button>
					</div>
					<div>{channelData.name}</div>
					<div>
						<button
							className='btn btn-primary'
							onClick={toggleAddMember}
						>
							add member
						</button>
					</div>
				</div>
				<div className='bg-blue-300 chat-box overflow-y-auto'>
					{messages.map((msg, index) => (
						<div
							ref={
								messages.length - 1 === index
									? spanRef
									: null
							}
						>
							{msg.body}
						</div>
					))}
					<span ref={spanRef}></span>
				</div>
				<form onSubmit={(e) => handleSend(e)}>
					<div className='bg-red-300 h-20 flex items-center justify-center gap-3'>
						<textarea
							name=''
							className='resize-none w-5/6'
							value={message}
							onChange={(e) => setMessage(e.target.value)}
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
