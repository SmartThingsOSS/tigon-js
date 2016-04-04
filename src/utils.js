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