import React, { useEffect } from 'react';
import { getMessages } from '../api/slack';
import { useAuth } from '../context/AuthContextProvider';

function Test() {
	const { state } = useAuth();

	useEffect(() => {
		(async () => {
			await getMessages(state.headers, state.id);
		})();
	}, []);
	return <div></div>;
}

export default Test;
