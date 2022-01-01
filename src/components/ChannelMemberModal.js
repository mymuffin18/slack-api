import React from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';

const ChannelMemberModal = ({ getMembers, setToggleChannelMemberModal }) => {
	const arr = getMembers();
	const closeModal = () => {
		setToggleChannelMemberModal((t) => !t);
	};
	const navigate = useNavigate();
	const nav = (id) => {
		navigate(`/dashboard/messages/${id}`);
	};
	return ReactDOM.createPortal(
		<div className='modal-bg bg-darkish'>
			<div className='card modal modal-size gap-2'>
				<div className='mt-5 overflow-y-auto'>
					<div className='text-lg text-center'>
						Channel Members
					</div>
					<ul className='flex flex-col gap-2'>
						{arr.map((user) => (
							<li
								key={user.id}
								className='hover:cursor-pointer'
								onClick={() => nav(user.id)}
							>
								{user.email}
							</li>
						))}
					</ul>
					<div className='flex justify-center items-center mt-2'>
						<button
							className='btn btn-danger'
							onClick={closeModal}
						>
							Close
						</button>
					</div>
				</div>
			</div>
		</div>,
		document.getElementById('portal')
	);
};

export default ChannelMemberModal;
