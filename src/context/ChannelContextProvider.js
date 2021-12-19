import React, { createContext, useContext, useReducer } from 'react';

const initialState = {
	channels: [],
};

const reducer = (state, action) => {
	switch (action.type) {
		case 'GET_CHANNELS':
			return {
				channels: action.payload,
			};
		default:
			return initialState;
	}
};

const ChannelContext = createContext();

const ChannelContextProvider = (props) => {
	const [state, dispatch] = useReducer(reducer, initialState);
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
