import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/auth';
import { useAuth } from '../context/AuthContextProvider';

function Register() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confPassword, setConfPassword] = useState('');
	const [error, setError] = useState({});
	const { dispatch } = useAuth();
	const navigate = useNavigate();
	const handleRegister = async (e) => {
		e.preventDefault();

		const { data, errors, headers } = await register(
			email,
			password,
			confPassword
		);

		if (Object.keys(errors).length !== 0) {
			setError(errors);
		} else {
			dispatch({
				type: 'LOGIN',
				payload: {
					id: data.data.id,
					user: data.data,
					headers: headers,
				},
			});

			navigate('/');
		}
	};
	return (
		<div>
			<label htmlFor='email'>Email</label>
			<input
				type='email'
				value={email}
				onChange={(e) => setEmail(e.target.value)}
			/>
			{error.email && (
				<span className='text-red-500'>{error.email}</span>
			)}
			<label htmlFor='password'>Password</label>
			<input
				type='password'
				value={password}
				onChange={(e) => setPassword(e.target.value)}
			/>
			{error.password && (
				<span className='text-red-500'>{error.password}</span>
			)}
			<label htmlFor='confirm_password'>Confirm Password</label>
			<input
				type='password'
				value={confPassword}
				onChange={(e) => setConfPassword(e.target.value)}
			/>
			{error.password_confirmation && (
				<span className='text-red-500'>
					{error.password_confirmation}
				</span>
			)}

			<button onClick={(e) => handleRegister(e)}>Register</button>
		</div>
	);
}

export default Register;
