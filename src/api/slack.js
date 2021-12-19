import axios from 'axios';
import { API_URL } from './url';

export const getMessages = async (headers, id) => {
	try {
		const res = await axios.get(
			`${API_URL}/messages?receiver_id=${id}&receiver_class=User`,
			{
				headers: {
					...headers,
				},
			}
		);

		console.log(res.data);
	} catch (error) {
		console.log(error.response.data.errors);
	}
};

export const getUsers = async (headers) => {
	let users = [];
	try {
		const res = await axios.get(`${API_URL}/users`, {
			headers: {
				...headers,
			},
		});
		users = res.data.data;
	} catch (e) {
		console.log(e.response);
	}

	return users;
};

export const getChannels = async (headers) => {
	try {
		const res = await axios.get(`${API_URL}/channels`, {
			headers: {
				...headers,
			},
		});

		console.log('????', res);
	} catch (error) {}
};

export const createChannel = async (headers) => {};
