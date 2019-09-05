const wordView = document.querySelector('.hangman-word')
const categoryView = document.querySelector('.hangman-category')
const drawingView = document.querySelector('.hangman-drawing')

const modalView = document.querySelector('.hangman-modal')
const modalContainer = document.querySelector('.hangman-modal_container')
const modalMessage = document.querySelector('.hangman-modal_message')

const levelView = document.querySelector('.hangman-level')

const ViewManager = () => { // Manipulates DOM views
	const showModal = () => {
		modalContainer.style.opacity = 1
    modalContainer.style.zIndex = 1

    modalView.style.opacity = 1
		modalView.style.transform = 'translateY(0px)'
	}

	const hideModal = () => {
		modalContainer.style.opacity = 0
    modalContainer.style.zIndex = 0

    modalView.style.opacity = 0
		modalView.style.transform = 'translateY(32px)'
	}

  const updateLevel = (level, totalLevels) => {
    levelView.innerHTML = `Level: ${level}/${totalLevels}`
  }

	const updateModalMessage = (status, word = '') => {
    let message = ''
    switch(status) {
      case 'win':
      case 'lose':
      message = `Game over! You ${status}!`
      break;

      case 'level_win':
      message = `You found the answer: <br><i> ${word} </i> <br> Good job!`
      break;

      case 'init':
      message = `Welcome to Hangman!`
      break;
    }
		modalMessage.innerHTML = message
	}

	const updateWord = word => {
		wordView.innerHTML = word.replace(/\$/g, "-")
	}

  const updateCategory = category => {
    categoryView.innerHTML = `<i>"${category}"</i>`
  }

	const updateDrawing = strikes => {
		if (strikes == 0)
			drawingView.style.backgroundImage = ''
		else drawingView.style.backgroundImage = `url('../images/hangman/${strikes}.png')`
	}
	return {
		showModal,
		hideModal,
		updateModalMessage,
		updateWord,
    updateCategory,
		updateDrawing,
    updateLevel
	}
}

export default ViewManager
