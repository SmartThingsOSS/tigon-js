/*!
 * Tigon - Javascript and mobile client communication
 * https://github.com/SmartThingsOSS/tigon-js
 * Apache 2.0 License | (c) SmartThings, Inc.
 */

import * as utils from './utils';
const agent = utils.getUserAgent();

class Tigon {
	/**
	 * Create a new Tigon object
	 * @param options - {
	 *      defaultMessageHandler: () => {}
     *  }
	 */
	constructor(options) {
		this.messageHandlers = [];
		this.messages = new Map();
		this.defaultMessageHandler = options && options.defaultMessageHandler || null;
	}

	_removeMessage(id) {
		const message = this.messages.get(id);
		this.messages.delete(id);
		return message;
	}

	/**
	 * Register an message handler
	 * @param callback
	 */
	addMessageHandler(callback) {
		if (utils.isFunction(callback)) {
			this.messageHandlers.push(callback);
		}
	}

	/**
	 * Remove an message handler
	 * @param callback
	 */
	removeMessageHandler(callback) {
		const index = this.messageHandlers.indexOf(callback);
		if (index >= 0) {
			this.messageHandlers.splice(index, 1);
		}
	}

	/**
	 * Send a message to the client
	 * @param message - the message you want to send to the client
	 */
	send(message) {
		if (!message) return;

		const messageForClient = {
			id: utils.createUUID(),
			payload: message
		};

		return new Promise((resolve, reject) => {
			this.messages.set(messageForClient.id, {
				onSuccess: resolve,
				onError: reject
			});

			const strMsg = JSON.stringify(messageForClient);

			if (agent.ios) {
				webkit.messageHandlers.tigon.postMessage(messageForClient);
			} else if (agent.android || agent.tizen) {
				window.tigonMessageHandler.handleMessage(strMsg);
			} else if (agent.windowsphone) {
				window.external.notify(strMsg);
			} else {
				if (this.defaultMessageHandler) {
					this.defaultMessageHandler(strMsg);
				} else {
					reject('Browser/OS is not supported.');
				}
			}
		});
	}

	/**
	 * Receiving messages from the client
	 * @param message
	 */
	receivedMessage(message) {
		this.messageHandlers.forEach(callback => {
			callback(message);
		});
	}

	/**
	 * Client code will call this on successful messages
	 * @param id
	 * @param payload
	 */
	receivedSuccessResponse(id, payload) {
		const message = this._removeMessage(id);
		if (message && utils.isFunction(message.onSuccess)) {
			message.onSuccess(payload);
		}
	}

	/**
	 * Client code will call this on unsuccessful messages
	 * @param id
	 * @param error
	 */
	receivedErrorResponse(id, error) {
		const message = this._removeMessage(id);
		if (message && utils.isFunction(message.onError)) {
			message.onError(error);
		}
	}
}

export default Tigon;
