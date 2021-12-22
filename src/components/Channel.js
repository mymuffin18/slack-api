import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getChannelDetail, getChannelMessages } from '../api/slack';
import { useAuth } from '../context/AuthContextProvider';
import AddMemberModal from './AddMemberModal';

const Channel = () => {
	const params = useParams();
	const { state } = useAuth();
	const [channelData, setChannelData] = useState({});
	const [toggleAddMemberModal, setToggleAddMemberModal] = useState(false);

	useEffect(() => {
		(async () => {
			// await getChannelMessages(state.headers, params.id);
			const data = await getChannelDetail(state.headers, params.id);
			setChannelData(data);
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [params.id]);

	const toggleAddMember = () => {
		setToggleAddMemberModal((t) => !t);
	};
	return (
		<>
			<div className='h-full flex flex-col'>
				<div className='bg-red-300 h-16 flex justify-around items-center'>
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
				<div className='bg-blue-300 flex-1'>chat div</div>
				<div className='bg-red-300 h-20 flex items-center justify-center gap-3'>
					<textarea
						name=''
						className='resize-none w-5/6'
					></textarea>
					<button className='btn btn-primary'>Send</button>
				</div>
			</div>

			{toggleAddMemberModal && (
				<AddMemberModal
					setToggleAddMemberModal={setToggleAddMemberModal}
					channelId={params.id}
				/>
			)}
		</>
	);
};

export default Channel;
