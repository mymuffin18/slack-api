import axios from 'axios';

export const getMessages = async (headers, id) => {
	try {
		const res = await axios.get(
			`https://slackapi.avionschool.com/api/v1/messages?receiver_id=${id}&receiver_class=User`,
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
