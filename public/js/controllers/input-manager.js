/* eslint-disable */
import _EventManager from './event-manager.js'
import { Button } from '../models.js'
import { normalizeEventType } from '../utils/common.js'

const buttons = []

const handleInput = (e) => { // Handle keyboard input with respect to the Button object
		let button, method
		method = normalizeEventType(e.type)
		button = getButton(e.key)

		if (button !== false) {
			if (method === 'press' && button.status === 'unused') button.press()
			if (method === 'release' && button.status === 'pressed') {
				button.release()
				_EventManager.publish('hangmanInput', e.key)
			}
		}
}

const getButton = (key) => { // Retrieve Button object from an array of buttons
	let found = false
	buttons.forEach(button => {
		if (button.key == key) {
			found = button
		}
	})
	return found
}

const InputManager = () => { // Holds and manages Button objects and their respective keyboard input events
	const init = () => {
		toggleInput(true)

		const setupButtons = (() => {
			let regButtons = []
			for (let i = 0; i < 26; i++) {
				regButtons.push({
					id: `button_${(i+10).toString(36)}`,
					key: `${(i+10).toString(36)}`
				})
			}
			for (let i = 0; i < regButtons.length; i++)
				buttons.push(new Button(regButtons[i].id, regButtons[i].key))
		})()
	}

	const toggleInput = (inputAllowed) => {
		if(inputAllowed){
			['keyup', 'keydown'].forEach((func) => {
				window.addEventListener(func, handleInput)
			})
		}
		else {
			['keyup', 'keydown'].forEach((func) => {
				window.removeEventListener(func, handleInput)
			})
		}
	}


	const getButtons = () => buttons

	return {
		init,
		getButtons,
		toggleInput
	}
}

export default InputManager

/* eslint-enable */
