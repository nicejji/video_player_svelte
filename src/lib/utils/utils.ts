export const formatSeconds = (seconds: number) =>
	new Date(seconds * 1000).toISOString().slice(seconds < 3600 ? 14 : 11, 19);
