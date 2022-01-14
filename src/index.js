import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import AuthContextProvider from './context/AuthContextProvider';
import NotificationContextProvider from './context/NotificationContextProvider';

ReactDOM.render(
	<AuthContextProvider>
		<div className='screen m-0'>
			<div className='h-full background'>
				<NotificationContextProvider>
					<App />
				</NotificationContextProvider>
			</div>
		</div>
	</AuthContextProvider>,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
