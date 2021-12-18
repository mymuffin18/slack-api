import axios from 'axios';
import { API_URL } from './url';

export const login = async (email, password) => {
	let data;
	let errors = [];
	let headers = {};
	try {
		const res = await axios.post(`${API_URL}/auth/sign_in`, {
			email: email,
			password: password,
		});

		data = res.data.data;
		headers['access-token'] = res.headers['access-token'];
		headers['client'] = res.headers['client'];
		headers['expiry'] = res.headers['expiry'];
		headers['uid'] = res.headers['uid'];
	} catch (e) {
		errors = [e.response.data.errors];
	}

	return { data, errors, headers };
};

export const register = async (email, password, confirm_password) => {
	let data;
	let errors = {};
	let headers = {};
	try {
		const res = await axios.post(`${API_URL}/auth/`, {
			email: email,
			password: password,
			password_confirmation: confirm_password,
		});

		data = res.data;
		headers['access-token'] = res.headers['access-token'];
		headers['client'] = res.headers['client'];
		headers['expiry'] = res.headers['expiry'];
		headers['uid'] = res.headers['uid'];

		console.log(res.data);
	} catch (error) {
		errors = error.response.data.errors;
	}

	return { data, errors, headers };
};
