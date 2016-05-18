/*
 * BotFather
 * Copyright(c) 2016 Aleki
 * MIT Licensed
 */
'use strict';

const https = require('https');

class BotFather {

	/**
	 * @param {string} token
	 */
	constructor(token) {
		this.token = token;
	}

	/**
	 * @param {string} method
 	 * @param {Object} parameters
 	 * @param {number} timeout
	 * @return {Promise}
	 * @see https://core.telegram.org/bots/api#making-requests
	 */
	api(method, parameters, timeout) {

		parameters = parameters || {};
		parameters = JSON.stringify(parameters);

		return new Promise((resolve, reject) => {

			const options = {
				host: 'api.telegram.org',
				port: 443,
				path: '/bot' + this.token + '/' + method,
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Content-Length': Buffer.byteLength(parameters)
				}
			};

			let request = https.request(options, (response) => {
				let data = '';
				response.on('data', (chunk) => {
					data += chunk;
				});
				response.on('end', () => {
					try {
						data = JSON.parse(data);
						resolve(data);
					} catch(exception) {
						reject(exception.message);
					}
				});
			});
			
			if(timeout) {
				request.setTimeout(timeout);
			}
			
			request.write(parameters);
			request.end();
		})
	}
}
module.exports = BotFather;