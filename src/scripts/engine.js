const state = {
  score: {
    playerScore: 0,
    computerScore: 0,
    scoreBox: document.querySelector('#scorePoints'),
  },
  cardSprites: {
    avatar: document.querySelector('#cardImage'),
    name: document.querySelector('#cardName'),
    type: document.querySelector('#cardType'),
  },
  fieldCards: {
    player: document.querySelector('#playerFieldCard'),
    computer: document.querySelector('#computerFieldCard'),
  },
  playerSides: {
    player1: ('#playerCards'),
    player1BOX: document.querySelector('#playerCards'),
    player2: '#computerCards',
    player2BOX: document.querySelector('#computerCards')
  },
  actions: {
    button: document.querySelector('#nextDuel'),
  },
};

const pathImages = './src/assets/icons/';

const cardData = [
  {
    id: 0,
    name: 'Blue Eyes White Dragon',
    type: 'Paper',
    img: `${pathImages}dragon.png`,
    winOf: [1],
    loseOf: [2],
  },
  {
    id: 1,
    name: 'Dark Magician',
    type: 'Rock',
    img: `${pathImages}magician.png`,
    winOf: [2],
    loseOf: [0],
  },
  {
    id: 2,
    name: 'Exodia The Forbiden One',
    type: 'Scissors',
    img: `${pathImages}exodia.png`,
    winOf: [0],
    loseOf: [1],
  },
];

async function getRandomCardId() {
  const randomIndex = Math.floor(Math.random() * cardData.length);
  return cardData[randomIndex].id;
};

async function createCardImage(IdCard, fieldSide) {
  const cardImage = document.createElement('img');
  cardImage.setAttribute('height', '100px');
  cardImage.setAttribute('src', `${pathImages}card-back.png`);
  cardImage.setAttribute('data-id', IdCard);
  cardImage.classList.add('card');

  if (fieldSide === state.playerSides.player1) {
    cardImage.addEventListener('mouseover', () => {
      drawSelectCard(IdCard);
    });

    cardImage.addEventListener('click', () => {
      setCardsField(cardImage.getAttribute('data-id'));
    });
  };

  return cardImage;
};

async function setCardsField(cardId) {
  await removeAllCardsImages();

  let computerCardId = await getRandomCardId();

  await showHiddenCardFieldsImages(true);

  await hiddenCardDetails();

  await drawCardsInfield(cardId, computerCardId);

  let duelResults = await checkDuelResults(cardId, computerCardId);

  await updateScore();
  await drawButton(duelResults);
};

async function drawCardsInfield(cardId, computerCardId) {
  state.fieldCards.player.src = cardData[cardId].img;
  state.fieldCards.computer.src = cardData[computerCardId].img;
}

async function showHiddenCardFieldsImages(value) {
  if(value === true) {
    state.fieldCards.player.style.display = 'block';
    state.fieldCards.computer.style.display = 'block';
  };

  if(value === false) {
    state.fieldCards.player.style.display = 'none';
    state.fieldCards.computer.style.display = 'none';
  };
};

async function hiddenCardDetails() {
  state.cardSprites.avatar.src = '';
  state.cardSprites.type.innerHTML = '';
  state.cardSprites.name.innerHTML = '';
};

async function drawButton(text) {
  state.actions.button.innerHTML = text.toUpperCase();
  state.actions.button.style.display = 'block';
};

async function updateScore() {
  state.score.scoreBox.innerHTML = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
};

async function checkDuelResults(playerCardId, computerCardId) {
  let duelResults = 'Draw';
  let playerCard = cardData[playerCardId];

  if (playerCard.winOf.includes(computerCardId)) {
    duelResults = 'Win';
    state.score.playerScore++;
  };

  if (playerCard.loseOf.includes(computerCardId)) {
    duelResults = 'Lose';
    state.score.computerScore++;
  };

  await playAudio(duelResults);

  return duelResults;
};

async function removeAllCardsImages() {
  let { player2BOX, player1BOX } = state.playerSides;
  let imgElements = player2BOX.querySelectorAll('img');
  imgElements.forEach((img) => img.remove());

  imgElements = player1BOX.querySelectorAll('img');
  imgElements.forEach((img) => img.remove());
};

async function drawSelectCard(index) {
  state.cardSprites.avatar.src = cardData[index].img;
  state.cardSprites.name.innerHTML = cardData[index].name;
  state.cardSprites.type.innerHTML = `Attribute: ${cardData[index].type}`;
};

async function drawCards(cardNumbers, fieldSide) {
  for (let i = 0; i < cardNumbers; i++) {
    const randomIdCard = await getRandomCardId();
    const cardImage = await createCardImage(randomIdCard, fieldSide);

    document.querySelector(fieldSide).appendChild(cardImage);
  };
};

async function resetDuel() {
  state.cardSprites.avatar.src = '';
  state.actions.button.style.display = 'none';

  state.fieldCards.player.style.display = 'none';
  state.fieldCards.computer.style.display = 'none';

  init();
};

async function playAudio(status) {
  const audio = new Audio(`./src/assets/audios/${status}.wav`);

  try {
    audio.play();
  } catch {

  };
};

function init() {
  hiddenCardDetails(false);

  drawCards(5, state.playerSides.player1);
  drawCards(5, state.playerSides.player2);

  const bgm = document.querySelector('#bgm');
  bgm.play();
};

init();