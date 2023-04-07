export const formatSeconds = (seconds: number) =>
	new Date(seconds * 1000).toISOString().slice(seconds < 3600 ? 14 : 11, 19);

export const verticalPercent = (node: HTMLElement, e: MouseEvent | TouchEvent) => {
	const height = node.clientHeight;
	const { bottom } = node.getBoundingClientRect();
	const posY = isTouchEvent(e) ? e.touches[0].clientY : e.clientY;
	const offset = Math.max(Math.min(bottom - posY, height), 0);
	return offset / height;
};

export const horizontalPercent = (node: HTMLElement, e: MouseEvent | TouchEvent) => {
	const width = node.clientWidth;
	const { left } = node.getBoundingClientRect();
	const posX = isTouchEvent(e) ? e.touches[0].clientX : e.clientX;
	const offset = Math.max(Math.min(posX - left, width), 0);
	return offset / width;
};

export const isTouchEvent = (e: MouseEvent | TouchEvent): e is TouchEvent => {
	return !!(e as TouchEvent)?.touches;
};

export const enterFS = (container: HTMLElement) => {
	const box = container as any;
	const enter = box.requestFullscreen ?? box.webkitRequestFullscreen ?? box.msRequestFullScreen;
	enter.apply(box);
};

export const exitFS = () => {
	const doc = document as any;
	const exit =
		doc.exitFullscreen ??
		doc.mozCancelFullScreen ??
		doc.webkitExitFullscreen ??
		doc.msExitFullscreen;
	exit.apply(doc);
};
