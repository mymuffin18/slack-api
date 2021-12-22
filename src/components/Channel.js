import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getChannelDetail, getChannelMessages } from '../api/slack';
import { useAuth } from '../context/AuthContextProvider';

const Channel = () => {
	const params = useParams();
	const { state } = useAuth();
	useEffect(() => {
		(async () => {
			await getChannelMessages(state.headers, params.id);
			await getChannelDetail(state.headers, params.id);
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [params.id]);
	return (
		<div className='h-full flex flex-col'>
			<div className='bg-red-300 h-16'>channel bar</div>
			<div className='bg-blue-300 flex-1'>chat div</div>
			<div className='bg-red-300 h-20 flex items-center justify-center gap-3'>
				<textarea name='' className='resize-none w-5/6'></textarea>
				<button className='btn btn-primary'>Send</button>
			</div>
		</div>
	);
};

export default Channel;
