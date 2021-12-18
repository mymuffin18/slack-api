import axios from 'axios';

export const login = async (email, password) => {
	let data;
	let errors = [];
	let headers = {};
	try {
		const res = await axios.post(
			'https://slackapi.avionschool.com/api/v1/auth/sign_in',
			{
				email: email,
				password: password,
			}
		);

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
