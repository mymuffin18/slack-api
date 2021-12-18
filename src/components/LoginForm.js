import React, { useState } from 'react';
import { login } from '../api/auth';
import { useAuth } from '../context/AuthContextProvider';

function LoginForm() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState([]);
	const { dispatch } = useAuth();
	const handleLogin = async (e) => {
		e.preventDefault();
		const res = await login(email, password);
		if (res.errors.length > 0) {
			setError(...res.errors);
		} else {
			dispatch({
				type: 'LOGIN',
				payload: {
					id: res.data.id,
					user: res.data,
					headers: res.headers,
				},
			});
		}
	};
	return (
		<div>
			<input
				type='email'
				value={email}
				onChange={(e) => setEmail((t) => e.target.value)}
			/>{' '}
			{'     '}
			<input
				type='password'
				value={password}
				onChange={(e) => setPassword((p) => e.target.value)}
			/>
			<button onClick={(e) => handleLogin(e)}>Login</button>
			{error &&
				error.map((e, i) => (
					<span key={i} className='text-red-500'>
						{e}
					</span>
				))}
		</div>
	);
}

export default LoginForm;
