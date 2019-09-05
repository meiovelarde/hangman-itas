const normalizeEventType = type =>
	(type === 'keyup' || type === 'mouseup') ? 'release' :
	(type === 'keydown' || type === 'mousedown') ? 'press' : type


export {
	normalizeEventType
}
