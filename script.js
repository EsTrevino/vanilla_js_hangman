//arrays-----------------------------------------------------------
const alphabetArray = [
	'A',
	'B',
	'C',
	'D',
	'E',
	'F',
	'G',
	'H',
	'I',
	'J',
	'K',
	'L',
	'M',
	'N',
	'O',
	'P',
	'Q',
	'R',
	'S',
	'T',
	'U',
	'V',
	'W',
	'X',
	'Y',
	'Z',
	' '
];
const wordArray = ['Plankton', 'Mr Krabs', 'Patrick Star', 'Sponge Bob', 'Squidward', 'Chum Bucket', 'Krusty Krab'];
const imageArray = [
	'Hangman_0.jpg',
	'Hangman_1.jpg',
	'Hangman_2.jpg',
	'Hangman_3.jpg',
	'Hangman_4.jpg',
	'Hangman_5.jpg',
	'Hangman_6.jpg',
	'Hangman_7.jpg'
];

//game state-------------------------------------------------------
let selectedWord;
let guessCount = 6;
let correctIndexesArray = [];

//html functions-----------------------------------------------
function displayButtons(selectedWord) {
	let container = document.getElementById('button-container');
	for (i = 0; i < alphabetArray.length; i++) {
		let div = document.createElement('div');
		div.setAttribute('id', 'button-display');
		let button = document.createElement('button');
		let text;
		if (i == alphabetArray.length - 1) {
			text = document.createTextNode('Space');
			button.setAttribute('id', 'space');
		} else {
			text = document.createTextNode(alphabetArray[i]);
			button.setAttribute('id', alphabetArray[i]);
		}
		button.appendChild(text);
		button.setAttribute('value', alphabetArray[i]);
		button.classList.add('btn');
		button.addEventListener('click', function(e) {
			let buttonValue = e.target.value;
			let buttonId = e.target.id;
			playerTurn(selectedWord, correctIndexesArray, buttonValue);
			document.getElementById(buttonId).disabled = true;
		});
		div.appendChild(button);
		container.appendChild(div);
	}
}

function clearChildNodes(containerElement) {
	while (containerElement.hasChildNodes()) {
		containerElement.removeChild(containerElement.firstChild);
	}
}

function removeButtons() {
	let buttonContainer = document.getElementById('button-container');
	clearChildNodes(buttonContainer);
}

function endGameDisplay(selectedWord, endGameMessage) {
	removeButtons();
	//turn into function
	let correctWordElement = document.getElementById('correct-word');
	let correctWordText = document.createTextNode(selectedWord);
	let buttonContainer = document.getElementById('button-container');
	let button = document.createElement('button');
	button.setAttribute('id', 'reset-btn');
	let gameMessageElement = document.getElementById('game-message');
	let lostMessage = document.createTextNode(endGameMessage);
	correctWordElement.innerHTML = 'Correct word was ' + selectedWord;
	gameMessageElement.innerHTML = endGameMessage;
	button.innerHTML = 'Play again?';
	button.addEventListener('click', function(e) {
		play();
	});
	buttonContainer.appendChild(button);
}

function restartGameDisplay() {
	let buttonContainer = document.getElementById('button-container');
	let correctWordContainer = document.getElementById('correct-word');
	let gameMessageContainer = document.getElementById('game-message');
	clearChildNodes(buttonContainer);
	correctWordContainer.innerHTML = '';
	gameMessageContainer.innerHTML = '';
}

function updateImageDisplay(guessCount) {
	let imageElement = document.getElementById('hangman-img');
	switch (guessCount) {
		case (guessCount = 6):
			imageElement.setAttribute('src', 'images/' + imageArray[0]);
			break;
		case (guessCount = 5):
			imageElement.setAttribute('src', 'images/' + imageArray[1]);
			break;
		case (guessCount = 4):
			imageElement.setAttribute('src', 'images/' + imageArray[2]);
			break;
		case (guessCount = 3):
			imageElement.setAttribute('src', 'images/' + imageArray[3]);
			break;
		case (guessCount = 2):
			imageElement.setAttribute('src', 'images/' + imageArray[4]);
			break;
		case (guessCount = 1):
			imageElement.setAttribute('src', 'images/' + imageArray[5]);
			break;
		case (guessCount = 0):
			imageElement.setAttribute('src', 'images/' + imageArray[6]);
			break;
	}
}

function updateDisplay(guessCount, word) {
	let guessElement = document.getElementById('guess-display');
	let wordElement = document.getElementById('word-display');
	guessElement.innerHTML = guessCount;
	wordElement.innerHTML = word;
	updateImageDisplay(guessCount);
}

//html functions end-------------------------------------------
//word logic functions---------------------------------------------------
function setGameWord() {
	let random = Math.floor(Math.random() * wordArray.length);
	selectedWord = wordArray[random];
}

function convertWordToUnderlines(word) {
	let wordArray = word.split('');
	for (i = 0; i < wordArray.length; i++) {
		wordArray[i] = '&nbsp;&nbsp&nbsp;&#95;&nbsp;&nbsp;&nbsp;';
	}
	return wordArray;
}

function check(word, letterGuess) {
	let answerArray = [];
	word
		.toUpperCase()
		.split('')
		.filter((character, index) => {
			if (letterGuess.toUpperCase().charCodeAt(0) == character.charCodeAt(0)) {
				answerArray.push(index);
			}
		});
	if (answerArray.length == 0) {
		return false;
	} else {
		answerArray.forEach(element => {
			correctIndexesArray.push(element);
		});
		return true;
	}
}

function updateArrays(hiddenWordArray, wordAnswerKeyArray) {
	for (i = 0; i < correctIndexesArray.length; i++) {
		let index = correctIndexesArray[i];
		hiddenWordArray[index] = '&nbsp;' + wordAnswerKeyArray[index] + '&nbsp;';
	}
	return hiddenWordArray;
}

//end of word logic functions------------------------------------------------------
//game functions ---------------------------------------------------------------------
function playerTurn(word, correctIndexesArray, letterGuess) {
	let wordAnswerKeyArray = word.split('');
	let hiddenWordArray = convertWordToUnderlines(word);
	let displayArray;
	let joinedDisplay;

	if (check(word, letterGuess)) {
		displayArray = updateArrays(hiddenWordArray, wordAnswerKeyArray);
		joinedDisplay = displayArray.join(' ');
		updateDisplay(guessCount, joinedDisplay);
		gameWatch(guessCount, correctIndexesArray, selectedWord);
	} else {
		guessCount--;
		displayArray = updateArrays(hiddenWordArray, wordAnswerKeyArray);
		joinedDisplay = displayArray.join(' ');
		updateDisplay(guessCount, joinedDisplay);
		gameWatch(guessCount, correctIndexesArray, selectedWord);
	}
}

function gameWatch(guessCount, correctIndexesArray, selectedWord) {
	if (guessCount == 0) {
		playerLoses(selectedWord);
	}
	if (correctIndexesArray.length == selectedWord.length) {
		playerWins(selectedWord);
	}
}

function playerLoses(selectedWord) {
	endGameDisplay(selectedWord, 'You lose...');
}

function playerWins(selectedWord) {
	endGameDisplay(selectedWord, 'You win!');
}

function resetGameState() {
	selectedWord = null;
	guessCount = 6;
	correctIndexesArray = [];
}

function play() {
	resetGameState();
	restartGameDisplay();
	setGameWord();
	updateDisplay(guessCount, convertWordToUnderlines(selectedWord));
	displayButtons(selectedWord, correctIndexesArray, guessCount);
}

play();
