import React, { createContext, useContext, useReducer } from 'react';

const initialState = {
	isOpen: false,
};

const reducer = (state, action) => {
	switch (action.type) {
		case 'OPEN_NAV':
			return {
				isOpen: true,
			};
		case 'CLOSE_NAV':
			return {
				isOpen: false,
			};
		default:
			return initialState;
	}
};

const NavContext = createContext();

const NavContextProvider = (props) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	const handleOpenNav = () => {
		dispatch({ type: 'OPEN_NAV' });
	};
	return (
		<NavContext.Provider value={{ state, dispatch, handleOpenNav }}>
			{props.children}
		</NavContext.Provider>
	);
};

export const useNav = () => {
	return useContext(NavContext);
};

export default NavContextProvider;
