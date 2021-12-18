import { listenerCount } from 'npm';
import React, { useEffect, useState } from 'react';
import { getMessages, getUsers } from '../api/slack';
import { useAuth } from '../context/AuthContextProvider';

function Test() {
	const { state } = useAuth();
	const [users, setUsers] = useState([]);
	useEffect(() => {
		(async () => {
			const data = await getUsers(state.headers);
			setUsers(data);
		})();
	}, []);
	return <div>{users && users.map((u) => <div>{u}</div>)}</div>;
}

export default Test;
