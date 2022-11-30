//設定遊戲狀態
const GAME_STATE = {
  FirstCardAwaits: "FirstCardAwaits",
  SecondCardAwaits: "SecondCardAwaits",
  CardsMatchFailed: "CardsMatchFailed",
  CardsMatched: "CardsMatched",
  GameFinished: "GameFinished"
};

//音效
const voice = document.querySelector(".voice");
const voice2 = document.querySelector(".voice2");
const voice3 = document.querySelector(".voice3");
const voice4 = document.querySelector(".voice4");

//卡片花色存放常數
const Symbols = [
  "./img/one.png", // 三角形
  "./img/two.png", // 星星
  "./img/three.png", // 圓形
  "./img/four.png" // 雨傘
];

//MVC v- view 視覺
const view = {
  //單張卡片背面
  getCardElement(index) {
    return `<div data-index="${index}"class="card back"></div>`;
  },
  //單張卡片數字以及花色內容，正面
  getCardContent(index) {
    const number = this.transformNumber((index % 13) + 1);
    const symbol = Symbols[Math.floor(index / 13)];
    return `
      <p>${number}</p>
      <img src="${symbol}" />
      <p>${number}</p>
    `;
  },
  //數字轉換，不是1、11、12、13 則回傳原本數字
  transformNumber(number) {
    switch (number) {
      case 1:
        return "A";
      case 11:
        return "J";
      case 12:
        return "Q";
      case 13:
        return "K";
      default:
        return number;
    }
  },
  //將卡片渲染進#cards，使用Array.from(Array(52).keys())
  displayCards(indexes) {
    const rootElement = document.querySelector("#cards");
    rootElement.innerHTML = indexes
      .map((index) => this.getCardElement(index))
      .join("");
  },
  //卡片判斷正面反面
  flipCards(...cards) {
    cards.map((card) => {
      if (card.classList.contains("back")) {
        //回傳正面
        card.classList.remove("back");
        card.innerHTML = this.getCardContent(Number(card.dataset.index));
        return;
      }
      //回傳背面
      card.classList.add("back");
      card.innerHTML = null;
    });
  },
  pairCards(...cards) {
    cards.map((card) => {
      card.classList.add("paired");
    });
  },
  renderScore(score) {
    document.querySelector(".score").textContent = `Score:${score}`;
  },
  renderTriedTimes(times) {
    document.querySelector(
      ".tried"
    ).textContent = `You have been shot ${times}`;
  },
  //監聽動畫結束後，清除wrong，once一次
  appendWrongAnimation(...cards) {
    cards.map((card) => {
      card.classList.add("wrong");
      card.addEventListener(
        "animationend",
        (event) => event.target.classList.remove("wrong"),
        { once: true }
      );
    });
  },
  //結束勝利函式
  showGameFinished() {
    document.body.style.background =
      "url('./img/winner.png')";
    document.body.style.backgroundSize = "cover";
    const div = document.createElement("div");
    div.classList.add("completed");
    div.innerHTML = `
      <p>축하합니다!</p>
      <p>Score: ${model.score}</p>
      <p>You've tried: ${model.triedTimes} times</p>
    `;
    const header = document.querySelector("#header");
    header.before(div);
  }
};

//MVC M- 資料管理
const model = {
  revealedCards: [], //暫存牌組
  score: 0,
  triedTimes: 0,
  isRevealedCardMatched() {
    return (
      this.revealedCards[0].dataset.index % 13 ===
      this.revealedCards[1].dataset.index % 13
    );
  }
};

//MVC C -控制
const controller = {
  currentState: GAME_STATE.FirstCardAwaits,
  //發牌，52張隨機牌組
  generateCards() {
    view.displayCards(utility.getRandomNumberArray(52));
  },
  dispatchCardAction(card) {
    if (!card.classList.contains("back")) {
      return;
    }
    switch (this.currentState) {
      case GAME_STATE.FirstCardAwaits:
        view.flipCards(card); // 翻牌
        model.revealedCards.push(card); // 暫存牌組陣列
        this.currentState = GAME_STATE.SecondCardAwaits;
        break;

      case GAME_STATE.SecondCardAwaits:
        view.renderTriedTimes(++model.triedTimes);
        view.flipCards(card);
        model.revealedCards.push(card);

        //判斷是否配對成功
        if (model.isRevealedCardMatched()) {
          //配對成功
          view.renderScore((model.score += 10));

          this.currentState = GAME_STATE.CardsMatched;
          voice3.play();
          view.pairCards(...model.revealedCards);
          model.revealedCards = [];

          if (model.score === 260) {
            console.log("showGameFinished");
            this.currentState = GAME_STATE.GameFinished;
            view.showGameFinished();
            voice2.pause();
            voice4.play();
            return;
          }
          this.currentState = GAME_STATE.FirstCardAwaits;
        } else {
          //配對失敗
          this.currentState = GAME_STATE.CardsMatchFailed;
          voice.play();
          voice.currentTime = 0;
          voice2.pause();
          view.appendWrongAnimation(...model.revealedCards);
          setTimeout(this.resetCards, 4000);
        }
        break;
    }
    console.log("this.currentState", this.currentState);
    console.log(
      "revealedCards",
      model.revealedCards.map((card) => card.dataset.index)
    );
  },
  resetCards() {
    voice2.play();
    voice2.currentTime = 0;
    view.flipCards(...model.revealedCards);
    model.revealedCards = [];
    controller.currentState = GAME_STATE.FirstCardAwaits;
  }
};
// 洗牌模組
const utility = {
  getRandomNumberArray(count) {
    const number = Array.from(Array(count).keys());
    for (let index = number.length - 1; index > 0; index--) {
      // for 遞迴迴圈
      let randomIndex = Math.floor(Math.random() * (index + 1)); // 解構賦值語法
      [number[index], number[randomIndex]] = [
        number[randomIndex],
        number[index]
      ];
    }
    return number;
  }
};

controller.generateCards();
document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("click", (event) => {
    controller.dispatchCardAction(card);
  });
});
