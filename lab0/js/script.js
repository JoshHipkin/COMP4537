import {
  INPUT_MESSAGE,
  WIN_MESSAGE,
  LOSE_MESSAGE,
} from "../lang/messages/en/user.js";

/**
 * ChatGPT was used for assist with bug fixing and code generation for keeping the buttons/
 * boxes within the browser window during shuffling.
 */

/**
 * Represents an instance of the memory game
 */

class Game {
  constructor(numButtons) {
    this.numButtons = numButtons;
    this.colors = [
      "red",
      "green",
      "blue",
      "yellow",
      "orange",
      "purple",
      "cyan",
    ];
    this.currentValue = 1;
    this.buttons = [];
    this.container = document.getElementById("gameContainer");
    this.container.innerHTML = "";

    const windowWidth = window.innerWidth - 50;

    let startX = 50;
    let startY = 50;
    const spacingX = 250;
    const spacingY = 150;

    for (let i = 0; i < numButtons; i++) {
      const rndIndex = Math.floor(Math.random() * this.colors.length);
      const color = this.colors.splice(rndIndex, 1)[0];

      if (startX + spacingX > windowWidth) {
        startX = 50;
        startY += spacingY;
      }

      const button = new Button(color, "10em", "5em", i + 1, startX, startY);
      this.buttons.push(button);
      button.draw(this.container);

      startX += spacingX;
    }
  }

  run() {
    setTimeout(() => {
      this.hideNumbers();

      let shuffleCount = 0;
      const shuffleInterval = setInterval(() => {
        this.shuffleButtons();
        shuffleCount++;

        if (shuffleCount == this.numButtons) {
          clearInterval(shuffleInterval);
          this.activateButtons();
        }
      }, 2000);
    }, this.numButtons * 1000);
  }

  hideNumbers() {
    this.buttons.forEach((button) => button.toggleValue());
  }

  shuffleButtons() {
    //width of buttons in pixels, approximated from actual em sizes.
    const buttonWidth = 190;
    const buttonHeight = 100;

    const maxX = this.container.offsetWidth - buttonWidth;
    const maxY = this.container.offsetHeight - buttonHeight;

    this.buttons.forEach((button) => {
      const rndX = Math.floor(Math.random() * maxX);
      const rndY = Math.floor(Math.random() * maxY);

      button.setLocation(rndX, rndY);
    });
  }

  activateButtons() {
    this.buttons.forEach((button) => {
      button.element.addEventListener("click", () => this.handleClick(button));
    });
  }

  handleClick(button) {
    if (this.currentValue === button.value) {
      button.toggleValue();

      if (this.currentValue == this.numButtons) {
        alert(WIN_MESSAGE);
        this.resetGame();
      }
      this.currentValue++;
    } else {
      alert(LOSE_MESSAGE);
      this.resetGame();
    }
  }

  resetGame() {
    this.container.innerHTML = "";
    this.currentValue = 1;
  }
}

/**
 * Button class to represent a game button.
 */
class Button {
  constructor(color, width, height, value, x, y) {
    this.color = color;
    this.width = width;
    this.height = height;
    this.value = value;
    this.x = x;
    this.y = y;
    this.hidden = false;
    this.element = null;
  }

  draw(container) {
    const button = document.createElement("div");
    button.style.backgroundColor = this.color;
    button.style.width = this.width;
    button.style.height = this.height;
    button.style.position = "absolute";
    button.style.left = `${this.x}px`;
    button.style.top = `${this.y}px`;
    button.style.display = "flex";
    button.style.alignItems = "center";
    button.style.justifyContent = "center";
    button.style.fontSize = "1.5em";
    button.style.border = "solid #000000 1px";
    button.style.cursor = "pointer";
    button.innerText = this.hidden ? "" : this.value;

    container.appendChild(button);
    this.element = button;
  }

  setLocation(x, y) {
    this.x = x;
    this.y = y;
    if (this.element) {
      this.element.style.left = `${this.x}px`;
      this.element.style.top = `${this.y}px`;
    }
  }

  toggleValue() {
    this.hidden = !this.hidden;
    if (this.element) {
      this.element.innerText = this.hidden ? "" : this.value;
    }
  }
}

/**
 * Input class holds player input information and a validate method.
 */
class Input {
  constructor(numButtons) {
    this.numButtons = numButtons;
  }

  validateEntry() {
    const num = Number(this.numButtons);
    if (isNaN(num) || this.numButtons > 7 || this.numButtons < 3) {
      alert(INPUT_MESSAGE);
      return false;
    }
    return true;
  }
}

document.getElementById("startButton").addEventListener("click", function () {
  const numButtons = document.getElementById("buttonCount").value;
  const input = new Input(numButtons);

  if (input.validateEntry()) {
    const game = new Game(input.numButtons);
    game.run();
  }
});
