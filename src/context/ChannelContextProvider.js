import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { getChannels } from '../api/slack';
import { useAuth } from './AuthContextProvider';

const initialState = {
	channels: [],
};

const reducer = (state, action) => {
	switch (action.type) {
		case 'ADD_CHANNEL':
			return {
				channels: [...state.channels, action.payload],
			};
		case 'GET_CHANNELS': {
			return {
				channels: action.payload,
			};
		}
		default:
			return initialState;
	}
};

const ChannelContext = createContext();

const ChannelContextProvider = (props) => {
	const [state, dispatch] = useReducer(reducer, initialState);
	const { state: authState } = useAuth();

	useEffect(() => {
		(async () => {
			const data = await getChannels(authState.headers);
			if (data !== undefined) {
				dispatch({ type: 'GET_CHANNELS', payload: data });
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<ChannelContext.Provider value={{ state, dispatch }}>
			{props.children}
		</ChannelContext.Provider>
	);
};

export const useChannels = () => {
	return useContext(ChannelContext);
};
export default ChannelContextProvider;
