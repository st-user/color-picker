import ContrastRatioAutoExtractionWorker from './ContrastRatioAutoExtractionWorker.js';

onmessage = event => {

  const message = event.data;
  const results = ContrastRatioAutoExtractionWorker.extractHighestContrastRatios(message);

  postMessage({ results: results });

}
