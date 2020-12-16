/*globals require */
/*globals describe */
/*globals it */
const expect = require('expect.js');
import ContrastRatioAutoExtractionWorker from '../contrast-ratio/ContrastRatioAutoExtractionWorker.js';
import ContrastRatioCalculator from '../contrast-ratio/ContrastRatioCalculator.js';

describe('ContrastRatioAutoExtractionWorker', () => {

    describe('#calcContrastRatioScore()', () => {

        describe('抽出範囲を絞り込まない場合、結果が取得できること', () => {

            const message = {
                targetColorLuminances: [
                    ContrastRatioCalculator.calcLuminance(255, 255, 255)
                ],
                condition: {
                    targetHueRange: [0, 36],
                    hueDivisionCount: 10,
                    selectedHueRange: [0, 360],
                    selectedSaturationRange: [0, 100],
                    selectedValueRange: [0, 100],
                    selectedContrastRatioRange: [1, 21]
                }
            };

            const results = ContrastRatioAutoExtractionWorker.calcContrastRatioScore(message);

            it('結果の件数', () => expect(Object.values(results).length).to.be(1));
            it('結果のコントラスト比', () => expect(results[0].avg).to.be(21));
        });


        describe('HSVの絞り込み条件で絞り込まれること', () => {

            const messageFactory = () => {
                return {
                    targetColorLuminances: [
                        ContrastRatioCalculator.calcLuminance(255, 255, 255)
                    ],
                    condition: {
                        targetHueRange: [36, 72],
                        hueDivisionCount: 10,
                        selectedHueRange: [0, 360],
                        selectedSaturationRange: [0, 100],
                        selectedValueRange: [0, 100],
                        selectedContrastRatioRange: [1, 21]
                    },
                    currentMinScore: undefined
                };
            };

            it('hue - 範囲内 - 1', () => {
                const message = messageFactory();
                message.condition.selectedHueRange = [0, 36];
                const results = ContrastRatioAutoExtractionWorker.calcContrastRatioScore(message);
                expect(Object.values(results).length).to.be(1);
            });

            it('hue - 範囲内 - 2', () => {
                const message = messageFactory();
                message.condition.selectedHueRange = [71, 360];
                const results = ContrastRatioAutoExtractionWorker.calcContrastRatioScore(message);
                expect(Object.values(results).length).to.be(1);
            });

            it('hue - 範囲外 - 1', () => {
                const message = messageFactory();
                message.condition.selectedHueRange = [0, 35];
                const results = ContrastRatioAutoExtractionWorker.calcContrastRatioScore(message);
                expect(Object.values(results).length).to.be(0);
            });

            it('hue - 範囲外 - 2', () => {
                const message = messageFactory();
                message.condition.selectedHueRange = [72, 360];
                const results = ContrastRatioAutoExtractionWorker.calcContrastRatioScore(message);
                expect(Object.values(results).length).to.be(0);
            });

            const saturationChecker = collectedSaturations => {
                return (h, s, v) => collectedSaturations[s] = s; // eslint-disable-line no-unused-vars
            };

            it('saturation', () => {
                const message = messageFactory();
                message.condition.selectedSaturationRange = [20, 30];
                const collectedSaturations = {};
                ContrastRatioAutoExtractionWorker.calcContrastRatioScore(
                    message, saturationChecker(collectedSaturations)
                );
                const collectedSaturationsArray = Object.values(collectedSaturations);
                collectedSaturationsArray.sort((a, b) => a - b);
                expect(collectedSaturationsArray.length).to.be(11);
                expect(collectedSaturationsArray[0]).to.be(20);
                expect(collectedSaturationsArray[10]).to.be(30);
            });

            const valueChecker = collectedValues => {
                return (h, s, v) => collectedValues[v] = v; // eslint-disable-line no-unused-vars
            };

            it('value', () => {
                const message = messageFactory();
                message.condition.selectedValueRange = [30, 35];
                const collectedValues = {};
                ContrastRatioAutoExtractionWorker.calcContrastRatioScore(
                    message, valueChecker(collectedValues)
                );
                const collectedValuesArray = Object.values(collectedValues);
                collectedValuesArray.sort((a, b) => a - b);
                expect(collectedValuesArray.length).to.be(6);
                expect(collectedValuesArray[0]).to.be(30);
                expect(collectedValuesArray[5]).to.be(35);
            });

        });

        describe('コントラスト比の範囲の絞り込み条件で絞り込まれること', () => {

            const messageFactory = () => {
                return {
                    targetColorLuminances: [
                        ContrastRatioCalculator.calcLuminance(0, 0, 0)
                    ],
                    condition: {
                        targetHueRange: [0, 36],
                        hueDivisionCount: 10,
                        selectedHueRange: [0, 360],
                        selectedSaturationRange: [0, 100],
                        selectedValueRange: [0, 100],
                        selectedContrastRatioRange: [1, 21]
                    },
                    currentMinScore: undefined
                };
            };

            it('contrast ratio - 範囲内 - 1', () => {
                const message = messageFactory();
                message.condition.selectedContrastRatioRange = [1, 1];
                const results = ContrastRatioAutoExtractionWorker.calcContrastRatioScore(message);
                expect(results[0].avg).to.be(1);
            });

            it('contrast ratio - 範囲内 - 2', () => {
                const message = messageFactory();
                message.condition.selectedContrastRatioRange = [21, 21];
                const results = ContrastRatioAutoExtractionWorker.calcContrastRatioScore(message);
                expect(results[0].avg).to.be(21);
            });

            it('contrast ratio - 範囲外 - 1', () => {
                const message = messageFactory();
                message.condition.selectedContrastRatioRange = [0, 0];
                const results = ContrastRatioAutoExtractionWorker.calcContrastRatioScore(message);
                expect(Object.values(results).length).to.be(0);
            });

            it('contrast ratio - 範囲外 - 2', () => {
                const message = messageFactory();
                message.condition.selectedContrastRatioRange = [22, 22];
                const results = ContrastRatioAutoExtractionWorker.calcContrastRatioScore(message);
                expect(Object.values(results).length).to.be(0);
            });

        });

    });
});
