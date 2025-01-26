export function randomInt(min: number, max: number): number {
	const minInt = Math.ceil(min);
	const maxInt = Math.floor(max);
	return Math.floor(Math.random() * (maxInt - minInt + 1)) + minInt;
}

export function randomSign(): number {
	return Math.random() >= 0.5 ? 1 : -1;
}
