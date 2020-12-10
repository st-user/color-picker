export default class ContrastRatioExplanations {

    #$contrastRatioExplanationClose;
    #$contrastRatioExplanationOpen;
    #$contrastRatioFunctionExplanations

    constructor(selectorClose, selectorOpen, selectorExplanations) {
        this.#$contrastRatioExplanationClose = document.querySelector(selectorClose);
        this.#$contrastRatioExplanationOpen = document.querySelector(selectorOpen);
        this.#$contrastRatioFunctionExplanations = document.querySelector(selectorExplanations);
    }

    setUpEvent() {
        const openExplanations = event => {
            this.#$contrastRatioExplanationOpen.style.display = 'none';
            this.#$contrastRatioExplanationClose.style.display = 'inline-block';
            this.#$contrastRatioFunctionExplanations.style.display = 'block';
            if (event) {
                event.stopPropagation();
            }
        };

        this.#$contrastRatioExplanationClose.addEventListener('click', event => {
            this.#$contrastRatioExplanationOpen.style.display = 'inline-block';
            this.#$contrastRatioExplanationClose.style.display = 'none';
            this.#$contrastRatioFunctionExplanations.style.display = 'none';
            event.stopPropagation();
        });

        this.#$contrastRatioExplanationOpen.addEventListener('click', openExplanations);

        openExplanations();
    }
}
