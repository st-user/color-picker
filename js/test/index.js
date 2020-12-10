import HsvRgbConverterTest from './HsvRgbConverterTest.js';
import ContrastRatioAutoExtractionWorkerTest from './ContrastRatioAutoExtractionWorkerTest.js';
import ContrastRatioCalculatorTest from './ContrastRatioCalculatorTest.js';
import RgbUtilTest from './RgbUtilTest.js';

(() => {

    const assertEquals = (expected, actual, message) => {
        if (expected === actual) {
            return;
        }
        message = message || '';
        throw `expected ${expected} but was ${actual}. detail: ` + message;
    };
    window.assertEquals = assertEquals;

    const assertFuzzyEquals = (expected, actual, torelance, message) => {
        const diff = Math.abs(expected - actual);
        if (diff <= torelance) {
            return;
        }
        message = message || '';
        throw `expected ${expected} but was ${actual}. detail: ` + message;
    };
    window.assertFuzzyEquals = assertFuzzyEquals;


})();


HsvRgbConverterTest();
ContrastRatioAutoExtractionWorkerTest();
ContrastRatioCalculatorTest();
RgbUtilTest();

console.log('End test.');
