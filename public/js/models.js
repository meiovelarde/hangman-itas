class Button {
	constructor(id, key) {
		this.id = id
		this.key = key
		this.status = 'unused'

		const createDOMButton = () => {
			const DOMElement = document.createElement('div')
			DOMElement.setAttribute('id', this.id)
			DOMElement.setAttribute('class', 'hangman-panel__button')
			DOMElement.setAttribute('data-status', this.status)
			DOMElement.innerHTML = this.key.toUpperCase()

			const panel = document.querySelector('.hangman-panel')
			panel.appendChild(DOMElement)

			return DOMElement
		}

		this.DOMElement = createDOMButton()
	}

	setViewStatus() {
		this.DOMElement.dataset.status = this.status
	}

	press() {
		this.status = 'pressed'
		this.setViewStatus()
	}

	release() {
		this.status = 'used'
		this.setViewStatus()
	}

	reset() {
		this.status = 'unused'
		this.setViewStatus()
	}
}

class Word {
	constructor(inputWord, category) {
		const word = []
		this.category = category

		for (let i = 0; i < inputWord.length; i++) {
			if (inputWord[i].match(/^[A-Za-z]+$/))
				word.push({
					character: inputWord[i],
					isFound: false,
					isLetter: true
				})
			else
				word.push({
					character: inputWord[i],
					isFound: false,
					isLetter: false
				})
		}

		this.getWord = () => {
			let gameWord = ''
			for (let i = 0; i < word.length; i++) {
				if (word[i].isLetter === true && word[i].isFound === false)
					gameWord = gameWord.concat('$')
				else gameWord = gameWord.concat(word[i].character)
			}

			return {
				category: this.category,
				word: gameWord
			}
		}

		this.isWordFound = () => {
			for (let i = 0; i < word.length; i++)
				if (word[i].isFound === false && word[i].isLetter === true)
					return false
			return true
		}

		this.searchLetter = letter => {
			let found = false
			for (let i = 0; i < word.length; i++)
				if (letter === word[i].character.toLowerCase()) {
					found = true
					word[i].isFound = true
				}
			return found
		}
	}
}

export {
	Button,
	Word
}
