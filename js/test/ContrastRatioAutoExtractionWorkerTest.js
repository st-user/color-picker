/*globals require */
/*globals describe */
/*globals it */
const expect = require('expect.js');
import ContrastRatioAutoExtractionWorker from '../contrast-ratio/ContrastRatioAutoExtractionWorker.js';
import ContrastRatioCalculator from '../contrast-ratio/ContrastRatioCalculator.js';

describe('ContrastRatioAutoExtractionWorker', () => {

    describe('#extractHighestContrastRatios()', () => {

        describe('抽出範囲を絞り込まない場合、探索対象分の結果が取得できること', () => {

            const message = {
                targetColorLuminances: [
                    ContrastRatioCalculator.calcLuminance(255, 255, 255)
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

            it('結果の件数', () => expect(results.length).to.be(2));
            it('結果のコントラスト比', () => expect(results[0].avg).to.be(21));
        });

        describe('HSVの絞り込み条件で絞り込まれること', () => {

            // { r: 128, g: 79, b: 94 } = HSV(342, 38, 50)
            const targetColorIndex = 128 * (256 * 256) + 79 * 256 + 94;

            const messageFactory = () => {
                return {
                    targetColorLuminances: [
                        ContrastRatioCalculator.calcLuminance(255, 255, 255)
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

            const exec = message => ContrastRatioAutoExtractionWorker.extractHighestContrastRatios(message);
            it('テストデータの事前確認', () => expect(exec(messageFactory()).length).to.be(1));

            it('hue - 範囲内', () => {
                const message = messageFactory();
                message.condition.hueRange = [342, 342];
                const results = ContrastRatioAutoExtractionWorker.extractHighestContrastRatios(message);
                expect(results.length).to.be(1);
            });


            it('hue - 範囲外 - 1', () => {
                const message = messageFactory();
                message.condition.hueRange = [343, 343];
                const results = ContrastRatioAutoExtractionWorker.extractHighestContrastRatios(message);
                expect(results.length).to.be(0);
            });


            it('hue - 範囲外 - 2', () => {
                const message = messageFactory();
                message.condition.hueRange = [341, 341];
                const results = ContrastRatioAutoExtractionWorker.extractHighestContrastRatios(message);
                expect(results.length).to.be(0);
            });


            it('saturation - 範囲内', () => {
                const message = messageFactory();
                message.condition.saturationRange = [38, 38];
                const results = ContrastRatioAutoExtractionWorker.extractHighestContrastRatios(message);
                expect(results.length).to.be(1);
            });


            it('saturation - 範囲外 - 1', () => {
                const message = messageFactory();
                message.condition.saturationRange = [39, 39];
                const results = ContrastRatioAutoExtractionWorker.extractHighestContrastRatios(message);
                expect(results.length).to.be(0);
            });


            it('saturation - 範囲外 - 2', () => {
                const message = messageFactory();
                message.condition.saturationRange = [37, 37];
                const results = ContrastRatioAutoExtractionWorker.extractHighestContrastRatios(message);
                expect(results.length).to.be(0);
            });


            it('value - 範囲内', () => {
                const message = messageFactory();
                message.condition.valueRange = [50, 50];
                const results = ContrastRatioAutoExtractionWorker.extractHighestContrastRatios(message);
                expect(results.length).to.be(1);
            });


            it('value - 範囲外 - 1', () => {
                const message = messageFactory();
                message.condition.valueRange = [51, 51];
                const results = ContrastRatioAutoExtractionWorker.extractHighestContrastRatios(message);
                expect(results.length).to.be(0);
            });


            it('value - 範囲外 - 2', () => {
                const message = messageFactory();
                message.condition.valueRange = [49, 49];
                const results = ContrastRatioAutoExtractionWorker.extractHighestContrastRatios(message);
                expect(results.length).to.be(0);
            });
        });

        describe('コントラスト比の範囲の絞り込み条件で絞り込まれること', () => {

            const messageFactory = () => {
                return {
                    targetColorLuminances: [
                        ContrastRatioCalculator.calcLuminance(0, 0, 0)
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

            const exec = message => ContrastRatioAutoExtractionWorker.extractHighestContrastRatios(message);
            it('テストデータの事前確認', () => expect(exec(messageFactory()).length).to.be(1));

            it('contrast ratio - 範囲内', () => {
                const message = messageFactory();
                message.condition.contrastRatioRange = [1, 1];
                const results = ContrastRatioAutoExtractionWorker.extractHighestContrastRatios(message);
                expect(results.length).to.be(1);
            });


            it('contrast ratio - 範囲外 - 1', () => {
                const message = messageFactory();
                message.condition.contrastRatioRange = [0, 0];
                const results = ContrastRatioAutoExtractionWorker.extractHighestContrastRatios(message);
                expect(results.length).to.be(0);
            });


            it('contrast ratio - 範囲外 - 2', () => {
                const message = messageFactory();
                message.condition.contrastRatioRange = [2, 2];
                const results = ContrastRatioAutoExtractionWorker.extractHighestContrastRatios(message);
                expect(results.length).to.be(0);
            });

        });

        describe('現時点の最小スコアで絞り込まれること', () => {

            const messageFactory = () => {
                return {
                    targetColorLuminances: [
                        ContrastRatioCalculator.calcLuminance(0, 0, 0)
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

            const exec = message => ContrastRatioAutoExtractionWorker.extractHighestContrastRatios(message);
            it('テストデータの事前確認', () => expect(exec(messageFactory()).length).to.be(1));

            it('current min score - 範囲内', () => {
                const message = messageFactory();
                message.currentMinScore = 0;
                const results = ContrastRatioAutoExtractionWorker.extractHighestContrastRatios(message);
                expect(results.length).to.be(1);
            });


            it('current min score - 範囲外 - 1', () => {
                const message = messageFactory();
                message.currentMinScore = 1;
                const results = ContrastRatioAutoExtractionWorker.extractHighestContrastRatios(message);
                expect(results.length).to.be(1);
            });


            it('current min score - 範囲外 - 2', () => {
                const message = messageFactory();
                message.currentMinScore = 2;
                const results = ContrastRatioAutoExtractionWorker.extractHighestContrastRatios(message);
                expect(results.length).to.be(0);
            });

        });

    });
});
