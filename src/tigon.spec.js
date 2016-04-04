import bowser from 'bowser';
import Tigon from './tigon';
import * as utils from './utils';

describe('tigon', () => {
	let tigon;

	beforeEach(() => {
		tigon = new Tigon();
	});

	describe('addMessageHandler() and removeMessageHandler()', () => {
		it('should add and remove callbacks from message handlers', () => {
			function test() {}
			function test2() {}
			tigon.addMessageHandler(test);
			tigon.addMessageHandler(test2);
			expect(tigon.messageHandlers.length).to.equal(2);
			expect(tigon.messageHandlers[0]).to.equal(test);
			expect(tigon.messageHandlers[1]).to.equal(test2);

			tigon.removeMessageHandler(test);
			expect(tigon.messageHandlers.length).to.equal(1);
			expect(tigon.messageHandlers[0]).to.equal(test2);
		});
	});
	
	describe('send()', () => {
		beforeEach(() => {
			sinon.stub(utils, 'createUUID').returns('uuid');
		});

		afterEach(() => {
			bowser.ios = false;
			bowser.android = false;
			bowser.tizen = false;
			bowser.windowsphone = false;
			utils.createUUID.restore();
		});

		it('should call ios message handler', () => {
			bowser.ios = true;
			window.webkit = {
				messageHandlers: {
					tigon: {
						postMessage: sinon.stub()
					}
				}
			};

			tigon.send({
				id: 123,
				data: 'test'
			});

			const expectedMessage = '{"id":"uuid","payload":{"id":123,"data":"test"}}';
			expect(webkit.messageHandlers.tigon.postMessage).to.have.been.calledWithExactly(expectedMessage);
			const callbacks = tigon.messages.get('uuid');
			expect(utils.isFunction(callbacks.onSuccess)).to.equal(true);
			expect(utils.isFunction(callbacks.onError)).to.equal(true);
			expect(utils.createUUID).to.have.callCount(1);
		});

		it('should call android message handler', () => {
			bowser.android = true;
			window.tigonMessageHandler = {
				handleMessage: sinon.stub()
			};

			tigon.send({
				id: 123,
				data: 'test'
			});

			const expectedMessage = '{"id":"uuid","payload":{"id":123,"data":"test"}}';
			expect(tigonMessageHandler.handleMessage).to.have.been.calledWithExactly(expectedMessage);
			const callbacks = tigon.messages.get('uuid');
			expect(utils.isFunction(callbacks.onSuccess)).to.equal(true);
			expect(utils.isFunction(callbacks.onError)).to.equal(true);
			expect(utils.createUUID).to.have.callCount(1);
		});

		it('should call tizen message handler', () => {
			bowser.tizen = true;
			window.tigonMessageHandler = {
				handleMessage: sinon.stub()
			};

			tigon.send({
				id: 123,
				data: 'test'
			});

			const expectedMessage = '{"id":"uuid","payload":{"id":123,"data":"test"}}';
			expect(tigonMessageHandler.handleMessage).to.have.been.calledWithExactly(expectedMessage);
			const callbacks = tigon.messages.get('uuid');
			expect(utils.isFunction(callbacks.onSuccess)).to.equal(true);
			expect(utils.isFunction(callbacks.onError)).to.equal(true);
			expect(utils.createUUID).to.have.callCount(1);
		});


		it('should call windows message handler', () => {
			bowser.windowsphone = true;
			window.external = {
				notify: sinon.stub()
			};

			tigon.send({
				id: 123,
				data: 'test'
			});

			const expectedMessage = '{"id":"uuid","payload":{"id":123,"data":"test"}}';
			expect(external.notify).to.have.been.calledWithExactly(expectedMessage);
			const callbacks = tigon.messages.get('uuid');
			expect(utils.isFunction(callbacks.onSuccess)).to.equal(true);
			expect(utils.isFunction(callbacks.onError)).to.equal(true);
			expect(utils.createUUID).to.have.callCount(1);
		});

		it('should call default message handler', () => {
			tigon.defaultMessageHandler = sinon.stub();

			tigon.send({
				id: 123,
				data: 'test'
			});

			const expectedMessage = '{"id":"uuid","payload":{"id":123,"data":"test"}}';
			expect(tigon.defaultMessageHandler).to.have.been.calledWithExactly(expectedMessage);
			const callbacks = tigon.messages.get('uuid');
			expect(utils.isFunction(callbacks.onSuccess)).to.equal(true);
			expect(utils.isFunction(callbacks.onError)).to.equal(true);
			expect(utils.createUUID).to.have.callCount(1);
		});

		it('should reject when no defaultMessageHandler or supported client', () => {
			const promise = tigon.send({
				id: 123,
				data: 'test'
			});

			return promise.then(() => {
					throw new Error('No error should be thrown here.');
				})
				.catch(err => {
					expect(err).to.equal('Browser/OS is not supported.');
				});
		});
	});

	describe('receiving messages', () => {
		let message;

		beforeEach(() => {
			message = {
				onSuccess: sinon.stub(),
				onError: sinon.stub()
			};
			tigon.messages.set(1, message);
		});

		describe('receivedMessage()', () => {
			it('should call callbacks with message', () => {
				const stub = sinon.stub();
				tigon.addMessageHandler(stub);
				tigon.receivedMessage('test');

				expect(stub).to.have.been.calledWithExactly('test');
			});
		});

		describe('receivedSuccessResponse()', () => {
			it('should look up and remove message by id then call successHandler callback', () => {
				tigon.receivedSuccessResponse(1, 'test');

				expect(tigon.messages.size).to.equal(0);
				expect(message.onSuccess).to.have.been.calledWithExactly('test');
				expect(message.onError).to.have.callCount(0);
			});
		});

		describe('receivedErrorResponse()', () => {
			it('should look up and remove message by id then call errorHandler callback', () => {
				tigon.receivedErrorResponse(1, 'test');

				expect(tigon.messages.size).to.equal(0);
				expect(message.onError).to.have.been.calledWithExactly('test');
				expect(message.onSuccess).to.have.callCount(0);
			});
		});
	});
});
