/* eslint-disable */
import _EventManager from './event-manager.js'
import wordList from '../game-data/words.js'

import InputManager from './input-manager.js'
import ViewManager from './view-manager.js'
import {
	Word
} from '../models.js'

const GameManager = () => { // Represents all functionality related to the game
	const gameState = { // Current game state
		status: 'init',
		level: 0,
		word: '',
		strikes: 0
	}

	const resetButtons = () => { // Reset button panel UI
		InputManager().getButtons().forEach(button => button.reset())
	}

	const handleKbInput = (key) => {
		// Handles event emitted by EventManager with relation to the Game
		if (!gameState.word.searchLetter(key)){
			gameState.strikes++
			ViewManager().updateDrawing(gameState.strikes)
		}
		ViewManager().updateWord(gameState.word.getWord().word)
	}

	const pickNewWord = () => {
		// Pick a new word from the word list. Word must not have been used/answered during the game
		let newWord = {},
			wordFound = false

		while (!wordFound) {
			newWord = wordList[Math.floor(Math.random() * Object.keys(wordList).length)]
			wordFound = (newWord.isUsed == false) ? true : false
		} newWord.isUsed = true

		return {
			category: newWord.category,
			word: newWord.word
		}
	}

	const setViews = () => {
			ViewManager().updateLevel(gameState.level, Object.keys(wordList).length)
			ViewManager().updateDrawing(gameState.strikes)
			ViewManager().updateWord(gameState.word.getWord().word)
			ViewManager().updateCategory(gameState.word.getWord().category)
	}

	const resetLevel = () => {
		// Represents a new level, resets all button UI, picks a new word, resets strike counter and increments level counter
		const newWord = pickNewWord()
		resetButtons()
		gameState.status = 'level_start'
		gameState.word = new Word(newWord.word, newWord.category)
		gameState.strikes = 0
		gameState.level++
		setViews()
	}

	const handleLevelWin = () => {
		const allWordsFound = () => {
			// Checks if all words from the wordList have been found
			let found = true
			for (let i in wordList)
				if (!wordList[i].isUsed)
					found = false
			return found
		}
		// Ends game if all words have been found, else just start a new level
		if (allWordsFound()){
			gameState.status = 'win'
		}
		else {
			pauseGame()
			resetLevel()
		}
	}

	const checkLevelStatus = () => {
		// Checks if the whole word has been found and can proceed to another level. Also checks if you have lost
		gameState.status = (gameState.word.isWordFound()) ? 'level_win' :
			(gameState.strikes == 10) ? 'lose' : 'level_ongoing'
	}

	const newGame = () => {
		// Initialize a new game
		for (let i in wordList)
			wordList[i].isUsed = false
		gameState.status = 'init'
		window.requestAnimationFrame(GAME_LOOP)
		gameState.level = 0
		gameState.strikes = 0
		resetLevel()
		setViews()
	}

	const pauseGame = () => {
		// Halt game input and show a modal. If modal is dismissed, continue game
		const dismissModal = () => {
			window.removeEventListener('keydown', dismissModal)
			InputManager().toggleInput(true)
			ViewManager().hideModal()

			// Start a new game upon dismissing Game Over modal.
			if(gameState.status == 'end_prompt') newGame()
		}

		// Show player the answer upon winning a level
		if(gameState.status == 'level_win')
			ViewManager().updateModalMessage(gameState.status, gameState.word.getWord().word)
		else ViewManager().updateModalMessage(gameState.status)
		InputManager().toggleInput(false)
		window.addEventListener('keydown', dismissModal)
		ViewManager().showModal()

	}

	const endGame = () => {
		// Start a new game upon dismissing Game Over modal.
		pauseGame()
		gameState.status = 'end_prompt'
	}

	const GAME_LOOP = () => { // Main game loop. Here you can see entry points for each of the gameState.statuses
		switch (gameState.status) {
		case 'level_win':
			handleLevelWin()
			break

		case 'win':
		case 'lose':
			endGame()
			break

		case 'level_ongoing':
		case 'level_start':
			checkLevelStatus()
			break
		}
		if (gameState.status != 'end_prompt') {
			window.requestAnimationFrame(GAME_LOOP)
		}
	}

	const init = () => {
		// Initialize input manager
		InputManager().init()
		_EventManager.subscribe('hangmanInput', handleKbInput)
		newGame()
	}

	return {
		init
	}
}

export default GameManager

/* eslint-enable */
