export default class Explanations {


    #$showExplanations;
    #$explanations;


    constructor() {
        this.#$showExplanations = document.querySelector('#showExplanations');
        this.#$explanations = document.querySelector('#explanations');
    }

    setUpEvents() {
        this.#$showExplanations.addEventListener('click', event => {
            this.#toggleExplanations();
            event.stopPropagation();
        });
        this.#$explanations.addEventListener('click', event => {
            event.stopPropagation();
        });
        window.addEventListener('click', () => {
            this.#$explanations.style.display = 'none';
        });
        this.#toggleExplanations();
    }

    #toggleExplanations() {
        const display = this.#$explanations.style.display;
        if (display === 'none') {
            this.#$explanations.style.display = 'block';
        } else {
            this.#$explanations.style.display = 'none';
        }
    }
}
