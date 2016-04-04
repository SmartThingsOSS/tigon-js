import * as utils from './utils';

describe('utils', () => {
	describe('isFunction()', () => {
		it('should determine if something is a function', () => {
			expect(utils.isFunction(function () {})).to.equal(true);
			expect(utils.isFunction(1)).to.equal(false);
			expect(utils.isFunction({})).to.equal(false);
		});
	});

	describe('getUserAgent()', () => {
		let userAgent;

		beforeEach(() => {
			navigator.__defineGetter__('userAgent', () => {
				return userAgent;
			});
		});

		it('should determine the user agent from the navigator', () => {
			userAgent = ' iPad ';
			expect(utils.getUserAgent()).to.eql({
				ios: true,
				android: false,
				windowsPhone: false,
				tizen: false
			});

			userAgent = ' Android ';
			expect(utils.getUserAgent()).to.eql({
				ios: false,
				android: true,
				windowsPhone: false,
				tizen: false
			});

			userAgent = ' Windows Phone ';
			expect(utils.getUserAgent()).to.eql({
				ios: false,
				android: false,
				windowsPhone: true,
				tizen: false
			});

			userAgent = ' Tizen ';
			expect(utils.getUserAgent()).to.eql({
				ios: false,
				android: false,
				windowsPhone: false,
				tizen: true
			});
		});
	});
});