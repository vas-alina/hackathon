import { Module } from '../core/module';
import * as Utils from '../utils';

export class ClicksModule extends Module {
	#increaseWrapper = this.#increaseClicksScore.bind(this);
	#currentTime;

	constructor(type, text, targetElement, clicksSquare, quantitySeconds) {
		super(type, text);
		this.#appendCalculatorDiv(targetElement);

		this.timerBlock = targetElement.querySelector('div.timer');
		this.timerBlock.innerHTML = this.#getHTML();

		this.eventBlock = {
			score: targetElement.querySelector('.score-block .primary'),
			timer: targetElement.querySelector('.timer-block .primary'),
			scoreBlock: targetElement.querySelector('.score-block'),
			currentTimeBlock: targetElement.querySelector('.timer-block'),
		};

		this.quantitySeconds = quantitySeconds;
		this.clicksSquare = clicksSquare;
		this.targetElement = targetElement;

		this.quantityClicks = 0;
		this.interval = null;
		this.isActivated = false;

		this.#updateTimer(quantitySeconds);
	}

	#updateTimer(time) {
		this.eventBlock.timer.innerHTML = Utils.getFormattedTime(time);
	}

	trigger() {
		const clickModule = document?.querySelector(`[data-type="${this.type}"]`);

		clickModule.addEventListener('click', () => {
			if (this.timerBlock && !this.isActivated) {
				Utils.makeElementVisible(this.timerBlock);
				this.#start();
			} else {
				this.#stop();
			}
		});
	}

	#start() {
		if (this.quantitySeconds === 0) {
			return;
		}

		if (this.eventBlock.currentTimeBlock.classList.contains('hidden')) {
			Utils.makeElementVisible(this.eventBlock.currentTimeBlock);
			Utils.makeElementHidden(this.eventBlock.scoreBlock);
		}

		this.isActivated = true;
		this.#currentTime = this.quantitySeconds;

		this.clicksSquare.addEventListener('click', this.#increaseWrapper);

		this.interval = setInterval(() => {
			this.#currentTime--;
			this.#updateTimer(this.#currentTime);
			if (this.#currentTime === 0) {
				this.#stop(this.#currentTime);
			}
		}, 1000);
	}

	#increaseClicksScore() {
		++this.quantityClicks;
	}

	#stop(time) {
		clearInterval(this.interval);
		this.clicksSquare.removeEventListener('click', this.#increaseWrapper);
		this.#updateInterface(time);

		this.quantityClicks = 0;
		this.isActivated = false;

		if (!this.eventBlock?.scoreBlock.classList.contains('hidden')) {
			let visibilityTime = 5;
			this.interval = setInterval(() => {
				visibilityTime--;
				if (visibilityTime == 0) {
					Utils.makeElementHidden(this.eventBlock.scoreBlock);
				}
			}, 1000);
		} else {
			Utils.makeElementHidden(this.eventBlock.scoreBlock);
			this.#start();
		}
	}

	#updateInterface(time) {
		if (time === 0) {
			Utils.makeElementVisible(this.eventBlock.scoreBlock);
			this.eventBlock.score.innerHTML = this.quantityClicks;
			Utils.makeElementHidden(this.eventBlock.currentTimeBlock);
		}
	}

	#appendCalculatorDiv(targetElement) {
		const timer = document.createElement('div');
		timer.classList.add('timer');
		targetElement.append(timer);
		this.timerBlock = targetElement.querySelector('div.timer');
		this.timerBlock.innerHTML = this.#getHTML();
	}

	#getHTML() {
		return `
        <div class="click-event-block">
        <div class="timer-block">
            <span>Время для клика: <span class="primary">${Utils.getFormattedTime(
							this.quantitySeconds
						)}</span></span>
        </div>
        <div class="score-block hide">
            <span class="current-score">Количество кликов: <span class="primary">${(this.quantityClicks = 0)}</span></span>
        </div>
        </div>`;
	}

	toHTML() {
		return `<li class="menu-item" data-type="${this.type}">${this.text}<li>`;
	}
}
