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
	let data = [];
	try {
		const res = await axios.get(`${API_URL}/channels`, {
			headers: {
				...headers,
			},
		});

		data = res.data.data;
		console.log(res);
	} catch (error) {
		console.error(error.response);
	}

	return data;
};

export const createChannel = async (users, channelName, headers) => {
	let status;
	let data = [];
	try {
		const res = await axios.post(
			`${API_URL}/channels`,
			{
				name: channelName,
				user_ids: users.map((user) => user.id),
			},
			{
				headers: {
					...headers,
				},
			}
		);

		data = res.data.data;
		status = res.status;
	} catch (error) {
		console.error(error.response);
	}

	return [data, status];
};
