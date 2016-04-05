export function createUUID() {
	let date = new Date().getTime();
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, char => {
		const replace = (date + Math.random() * 16) % 16 | 0;
		date = Math.floor(date / 16);
		return (char === 'x' ? replace : (replace & 0x3 | 0x8)).toString(16);
	});
}

export function isFunction(thing) {
	return thing && typeof thing === 'function';
}

export function getUserAgent() {
	const userAgent = navigator && navigator.userAgent || '';
	return {
		ios: /(ipod|iphone|ipad)/i.test(userAgent),
		android: /(android)/i.test(userAgent),
		windowsPhone: /windows phone/i.test(userAgent),
		tizen: /tizen/i.test(userAgent)
	};
}
