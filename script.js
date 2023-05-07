const lettersContainer = document.getElementById("letters-container");
const wordInput = document.getElementById("word-input");
const submitWordButton = document.getElementById("submit-word");
const minLengthElement = document.getElementById("min-length");
const scoreElement = document.getElementById("score");
const timerElement = document.getElementById("timer");
const modal = document.getElementById('modal');
const modalMessage = document.getElementById('modal-message');
const finalScore = document.getElementById('final-score');
const retryButton = document.getElementById('retry-button');

let score = 0;
let timer = 120;
let correctWordsCount = 0;
let minLength = 3;
let usedLetters = new Set();
let usedWords = new Set();

function isWordDuplicate(word) {
  return usedWords.has(word);
}

submitWordButton.addEventListener("click", async () => {
  const word = wordInput.value;
  wordInput.value = "";

  const givenLetters = lettersContainer.textContent;

  if (isWordDuplicate(word)) {
    alert('この文字は既に使われています');
  } else if (word.length < minLength) {
    alert(`${minLength} 文字以上の単語を入力してください`);
  } else if (isWordUsingGivenLetters(word, givenLetters) && await isWordValid(word)) {
    usedWords.add(word);
    updateUsedLetters(word, givenLetters);
    updateScore(word);
    addNewLetter();
    correctWordsCount++;
    adjustDifficulty();
  } else {
    alert('無効な単語です');
  }
});

function updateUsedLetters(word, givenLetters) {
    for (const letter of givenLetters) {
      if (word.includes(letter)) {
        usedLetters.add(letter);
      }
    }
    updateLetterColors();
  }

function updateLetterColors() {
    const letterElements = document.querySelectorAll('#letters-container span');
  
    letterElements.forEach((element) => {
      const letter = element.textContent;
  
      if (usedLetters.has(letter)) {
        element.style.color = 'gray';
      }
    });
  }  

function adjustDifficulty() {
    if (correctWordsCount % 5 === 0) {
        minLength = Math.min(minLength + 1, 10);
        minLengthChange({ target: { value: minLength } });
    }
}

function isWordUsingGivenLetters(word, givenLetters) {
    for (const letter of givenLetters) {
      if (word.includes(letter)) {
        return true;
      }
    }
    return false;
  }

async function fetchWordsFromDatamuse(letters) {
    const apiUrl = `https://api.datamuse.com/words?sp=${letters}*`;
    const response = await fetch(apiUrl);
  
    if (response.ok) {
      const wordsData = await response.json();
      const words = wordsData.map(wordObj => wordObj.word);
      return words;
    } else {
      throw new Error('単語の取得に失敗しました');
    }
  }
  
  async function isWordValid(word) {
  
    try {
      const words = await fetchWordsFromDatamuse(word);
      return words.includes(word);
    } catch (error) {
      console.error(error);
      return false;
    }
  }  

function generateRandomLetter() {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    return alphabet[Math.floor(Math.random() * alphabet.length)];
}

function minLengthChange(event) {
    minLength = event.target.value;
    minLengthElement.textContent = minLength;
}

function addNewLetter() {
    const letter = generateRandomLetter();
    const letterElement = document.createElement("span");
    letterElement.textContent = letter;
    lettersContainer.appendChild(letterElement);
}

function updateScore(word) {
    score += word.length - 2;
    scoreElement.textContent = score;
}

function startTimer() {
    const timerInterval = setInterval(() => {
        timer -= 1;
        timerElement.textContent = timer;

        if (timer <= 0) {
            clearInterval(timerInterval);
            showGameOverModal();
        }
    }, 1000);
}

function resetGame() {
    score = 0;
    correctWordsCount = 0;
    minLength = 3;
    usedLetters = new Set();
    usedWords = new Set();
    scoreElement.textContent = score;
    timer = 120;
    timerElement.textContent = timer;
    lettersContainer.textContent = "";
    initializeGame();
  }  

function showGameOverModal() {
    finalScore.textContent = score;
    modal.classList.remove('hidden');
  }
  
  retryButton.addEventListener('click', () => {
    modal.classList.add('hidden');
    resetGame();
  });
  

// Initialize the game
function initializeGame() {
    for (let i = 0; i < 3; i++) {
        addNewLetter();
    }
    minLengthChange({ target: { value: minLength } });
    startTimer();
}

initializeGame();

