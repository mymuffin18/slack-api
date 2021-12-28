import React, { createContext, useContext, useEffect, useState } from 'react';
import { getUsers } from '../api/slack';
import { useAuth } from './AuthContextProvider';

const UsersContext = createContext();
const UsersContextProvider = (props) => {
	const [users, setUsers] = useState([]);
	const { state } = useAuth();
	useEffect(() => {
		(async () => {
			if (state.login) {
				const data = await getUsers(state.headers);
				setUsers(data);
			}
		})();
	}, [state.login, state.headers]);
	return (
		<UsersContext.Provider value={users}>
			{props.children}
		</UsersContext.Provider>
	);
};

export const useUsers = () => {
	return useContext(UsersContext);
};

export default UsersContextProvider;
