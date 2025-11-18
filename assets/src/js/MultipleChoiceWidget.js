import { Widget } from "./Widget.js";

export class MultipleChoiceWidget extends Widget {
    constructor(container, page) {
        super(container, page);

        this.SELECTORS = Object.freeze({
            CHOICES: '.choices',
            CHOICE_BUTTON: '.button-choice',
            FEEDBACK_CORRECT: '.feedback[data-type="correct"]',
            FEEDBACK_INCORRECT: '.feedback[data-type="incorrect"]'
        });

        this.elements = {
            choices: null,
            choiceButtons: [],
            feedbackCorrect: null,
            feedbackIncorrect: null
        };

        this.state = {
            answered: false,
            currentIndex: 0
        };

        this.init();
    }

    init() {
        this.cacheElements();
        this.bindEvents();
        this.initializeAccessibility();
    }

    cacheElements() {
        this.elements.choices = this.container.querySelector(this.SELECTORS.CHOICES);
        this.elements.choiceButtons = Array.from(
            this.container.querySelectorAll(this.SELECTORS.CHOICE_BUTTON)
        );
        this.elements.feedbackCorrect = this.container.querySelector(this.SELECTORS.FEEDBACK_CORRECT);
        this.elements.feedbackIncorrect = this.container.querySelector(this.SELECTORS.FEEDBACK_INCORRECT);

        // Hide feedback initially
        if (this.elements.feedbackCorrect) {
            this.elements.feedbackCorrect.style.display = 'none';
        }
        if (this.elements.feedbackIncorrect) {
            this.elements.feedbackIncorrect.style.display = 'none';
        }
    }

    bindEvents() {
        if (!this.elements.choiceButtons.length) return;

        this.elements.choiceButtons.forEach((button, index) => {
            button.addEventListener('click', () => this.handleChoice(button, index));
            button.addEventListener('keydown', (e) => this.handleKeydown(e, index));
        });
    }

    initializeAccessibility() {
        if (!this.elements.choiceButtons.length) return;

        // Set tabindex: first button is focusable, rest are not (roving tabindex pattern)
        this.elements.choiceButtons.forEach((button, index) => {
            button.setAttribute('tabindex', index === 0 ? '0' : '-1');
        });
    }

    handleChoice(button, index) {
        if (this.state.answered) return;

        const isCorrect = button.getAttribute('data-correct') === 'true';

        // Update aria-checked for the selected button
        this.updateSelection(index);

        if (isCorrect) {
            this.handleCorrectAnswer();
        } else {
            this.handleIncorrectAnswer(button);
        }
    }

    updateSelection(newIndex) {
        // Update aria-checked state for radio group behavior
        this.elements.choiceButtons.forEach((button, index) => {
            button.setAttribute('aria-checked', index === newIndex ? 'true' : 'false');
        });
        this.state.currentIndex = newIndex;
    }

    handleCorrectAnswer() {
        this.state.answered = true;

        // Show correct feedback
        if (this.elements.feedbackCorrect) {
            this.elements.feedbackCorrect.style.display = 'block';
        }

        // Hide incorrect feedback if visible
        if (this.elements.feedbackIncorrect) {
            this.elements.feedbackIncorrect.style.display = 'none';
        }

        // Disable all buttons
        this.elements.choiceButtons.forEach(button => {
            button.disabled = true;
            button.setAttribute('aria-disabled', 'true');
        });

        // Play effects
        if (this.page.playCorrectSound) {
            this.page.playCorrectSound();
        }
        if (this.page.celebrate) {
            this.page.celebrate();
        }
    }

    handleIncorrectAnswer(button) {
        // Disable the incorrect button
        button.disabled = true;
        button.setAttribute('aria-disabled', 'true');

        // Show incorrect feedback
        if (this.elements.feedbackIncorrect) {
            this.elements.feedbackIncorrect.style.display = 'block';
        }

        // Move focus to next available button
        this.focusNextAvailableButton();
    }

    focusNextAvailableButton() {
        const availableButtons = this.elements.choiceButtons.filter(btn => !btn.disabled);
        
        if (availableButtons.length > 0) {
            // Find the next non-disabled button from current position
            let nextButton = null;
            for (let i = this.state.currentIndex + 1; i < this.elements.choiceButtons.length; i++) {
                if (!this.elements.choiceButtons[i].disabled) {
                    nextButton = this.elements.choiceButtons[i];
                    break;
                }
            }
            
            // If no button found after current, check from beginning
            if (!nextButton) {
                for (let i = 0; i < this.state.currentIndex; i++) {
                    if (!this.elements.choiceButtons[i].disabled) {
                        nextButton = this.elements.choiceButtons[i];
                        break;
                    }
                }
            }

            if (nextButton) {
                // Update tabindex for roving tabindex
                this.elements.choiceButtons.forEach(btn => btn.setAttribute('tabindex', '-1'));
                nextButton.setAttribute('tabindex', '0');
                nextButton.focus();
            }
        }
    }

    handleKeydown(event, index) {
        if (this.state.answered) return;

        const { key } = event;
        const currentButton = this.elements.choiceButtons[index];

        // Space or Enter to select
        if (key === ' ' || key === 'Enter') {
            event.preventDefault();
            this.handleChoice(currentButton, index);
            return;
        }

        // Arrow key navigation (only among enabled buttons)
        let targetIndex = -1;

        if (key === 'ArrowDown' || key === 'ArrowRight') {
            event.preventDefault();
            targetIndex = this.getNextEnabledIndex(index, 1);
        } else if (key === 'ArrowUp' || key === 'ArrowLeft') {
            event.preventDefault();
            targetIndex = this.getNextEnabledIndex(index, -1);
        } else if (key === 'Home') {
            event.preventDefault();
            targetIndex = this.getNextEnabledIndex(-1, 1);
        } else if (key === 'End') {
            event.preventDefault();
            targetIndex = this.getNextEnabledIndex(this.elements.choiceButtons.length, -1);
        }

        if (targetIndex !== -1) {
            this.moveFocus(targetIndex);
        }
    }

    getNextEnabledIndex(currentIndex, direction) {
        const buttonCount = this.elements.choiceButtons.length;
        let newIndex = currentIndex;

        // Loop through buttons to find next enabled one
        for (let i = 0; i < buttonCount; i++) {
            newIndex = (newIndex + direction + buttonCount) % buttonCount;
            if (!this.elements.choiceButtons[newIndex].disabled) {
                return newIndex;
            }
        }

        // No enabled buttons found
        return -1;
    }

    moveFocus(newIndex) {
        
        // Update tabindex (roving tabindex pattern)
        this.elements.choiceButtons.forEach((button, index) => {
            button.setAttribute('tabindex', index === newIndex ? '0' : '-1');
        });

        // Focus the new button
        this.elements.choiceButtons[newIndex].focus();
        this.state.currentIndex = newIndex;
    }
}