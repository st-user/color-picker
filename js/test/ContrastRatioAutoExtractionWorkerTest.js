import ContrastRatioAutoExtractionWorker from '../ContrastRatioAutoExtractionWorker.js';

const ContrastRatioAutoExtractionWorkerTest = (() => {
    return () => {


        (() => {

            const message = {
                targetColors: [
                    { r: 255, g: 255, b: 255 }
                ],
                condition: {
                    targetRange: [0, 2],
                    hueRange: [0, 360],
                    saturationRange: [0, 100],
                    valueRange: [0, 100],
                    contrastRatioRange: [1, 21]
                },
                currentMinScore: undefined
            };

            const results = ContrastRatioAutoExtractionWorker.extractHighestContrastRatios(message);
            assertEquals(2, results.length, 'Passess all constraints');
            assertEquals(21, results[0].avg, 'Passess all constraints');

        })();

        (() => {

            // { r: 128, g: 79, b: 94 } = HSV(342, 38, 50)
            const targetColorIndex = 128 * (256 * 256) + 79 * 256 + 94;

            const messageFactory = () => {
                return {
                    targetColors: [
                        { r: 255, g: 255, b: 255 }
                    ],
                    condition: {
                        targetRange: [targetColorIndex, targetColorIndex + 1],
                        hueRange: [0, 360],
                        saturationRange: [0, 100],
                        valueRange: [0, 100],
                        contrastRatioRange: [1, 21]
                    },
                    currentMinScore: undefined
                };
            };


            let results = ContrastRatioAutoExtractionWorker.extractHighestContrastRatios(messageFactory());

            assertEquals(1, results.length, 'Check if data is valid.');

            /* hue */
            let message = messageFactory();
            message.condition.hueRange = [342, 342];
            results = ContrastRatioAutoExtractionWorker.extractHighestContrastRatios(message);
            assertEquals(1, results.length, 'hue constraints - 1 ');

            message.condition.hueRange = [343, 343];
            results = ContrastRatioAutoExtractionWorker.extractHighestContrastRatios(message);
            assertEquals(0, results.length, 'hue constraints - 2');

            message.condition.hueRange = [341, 341];
            results = ContrastRatioAutoExtractionWorker.extractHighestContrastRatios(message);
            assertEquals(0, results.length, 'hue constraints - 3');

            /* saturation */
            message = messageFactory();
            message.condition.saturationRange = [38, 38];
            results = ContrastRatioAutoExtractionWorker.extractHighestContrastRatios(message);
            assertEquals(1, results.length, 'saturation constraints - 1 ');

            message.condition.saturationRange = [39, 39];
            results = ContrastRatioAutoExtractionWorker.extractHighestContrastRatios(message);
            assertEquals(0, results.length, 'saturation constraints - 2');

            message.condition.saturationRange = [37, 37];
            results = ContrastRatioAutoExtractionWorker.extractHighestContrastRatios(message);
            assertEquals(0, results.length, 'saturation constraints - 3');

            /* value */
            message = messageFactory();
            message.condition.valueRange = [50, 50];
            results = ContrastRatioAutoExtractionWorker.extractHighestContrastRatios(message);
            assertEquals(1, results.length, 'value constraints - 1 ');

            message.condition.valueRange = [51, 51];
            results = ContrastRatioAutoExtractionWorker.extractHighestContrastRatios(message);
            assertEquals(0, results.length, 'value constraints - 2');

            message.condition.valueRange = [49, 49];
            results = ContrastRatioAutoExtractionWorker.extractHighestContrastRatios(message);
            assertEquals(0, results.length, 'value constraints - 3');

        })();

        (() => {

            const messageFactory = () => {
                return {
                    targetColors: [
                        { r: 0, g: 0, b: 0 }
                    ],
                    condition: {
                        targetRange: [0, 1],
                        hueRange: [0, 360],
                        saturationRange: [0, 100],
                        valueRange: [0, 100],
                        contrastRatioRange: [1, 21]
                    },
                    currentMinScore: undefined
                };
            };


            let results = ContrastRatioAutoExtractionWorker.extractHighestContrastRatios(messageFactory());

            assertEquals(1, results.length, 'Check if data is valid.');

            /* contrast ratio */
            let message = messageFactory();
            message.condition.contrastRatioRange = [1, 1];
            results = ContrastRatioAutoExtractionWorker.extractHighestContrastRatios(message);
            assertEquals(1, results.length, 'contrast ratio constraints - 1 ');

            message.condition.contrastRatioRange = [0, 0];
            results = ContrastRatioAutoExtractionWorker.extractHighestContrastRatios(message);
            assertEquals(0, results.length, 'contrast ratio constraints - 2 ');

            message.condition.contrastRatioRange = [2, 2];
            results = ContrastRatioAutoExtractionWorker.extractHighestContrastRatios(message);
            assertEquals(0, results.length, 'contrast ratio constraints - 3 ');

            /* min score */
            message = messageFactory();
            message.currentMinScore = 0;
            results = ContrastRatioAutoExtractionWorker.extractHighestContrastRatios(message);
            assertEquals(1, results.length, 'min score constraints - 1 ');

            message.currentMinScore = 1;
            results = ContrastRatioAutoExtractionWorker.extractHighestContrastRatios(message);
            assertEquals(1, results.length, 'min score constraints - 2 ');

            message.currentMinScore = 2;
            results = ContrastRatioAutoExtractionWorker.extractHighestContrastRatios(message);
            assertEquals(0, results.length, 'min score constraints - 3 ');

        })();


    };
})();

export default ContrastRatioAutoExtractionWorkerTest;
