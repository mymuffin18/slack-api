import React, { createContext, useContext, useReducer } from 'react';
import Notification from '../components/Notification';
import { v4 } from 'uuid';
const reducer = (state, action) => {
	switch (action.type) {
		case 'ADD_NOTIFICATION':
			return [...state, { id: v4(), ...action.payload }];
		case 'REMOVE_NOTIFICATION':
			return state.filter((el) => el.id !== action.id);
		default:
			return state;
	}
};

const NotificationContext = createContext();

const NotificationContextProvider = (props) => {
	const [state, dispatch] = useReducer(reducer, []);
	return (
		<NotificationContext.Provider value={{ dispatch }}>
			<div className='notification-wrapper'>
				{state.map((note) => {
					return (
						<Notification
							dispatch={dispatch}
							key={note.id}
							{...note}
						/>
					);
				})}
			</div>
			{props.children}
		</NotificationContext.Provider>
	);
};

export const useNotifications = () => {
	return useContext(NotificationContext);
};

export default NotificationContextProvider;
