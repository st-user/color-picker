export default class ContrastRatioAutoExtractionService {


    #workers;

    constructor() {
        this.#workers = [];
    }

    doService(targetColorLuminances, conditions, threadCount, numberOfResults) {

        return new Promise((resolve, reject) => {

            let resultFromWrokers = [];
            let processedTaskCount = 0;
            let currentMinScore = -Infinity;
            let error = false;

            for (let i = 0; i < threadCount; i++) {
                let worker = this.#workers[i];
                if (!worker) {
                    worker = new Worker('js/contrast-ratio-auto-extraction-worker.js?q=' + window.APP_VERSION);
                    this.#workers[i] = worker;
                    worker.onerror = () => {
                        error = true;
                        this.#workers.forEach(w => w.terminate());
                        this.#workers = [];
                        reject({
                            error: '処理実行中にエラーが発生しました。ネットワークの切断などの問題が発生した可能性があります。'
                        });
                    };
                }

                const postMessage = () => {

                    if (error) {
                        return;
                    }

                    const condition = conditions[processedTaskCount];
                    processedTaskCount++;
                    worker.postMessage({
                        condition: condition,
                        targetColorLuminances: targetColorLuminances,
                        currentMinScore: currentMinScore
                    });
                };

                worker.onmessage = event => {

                    if (error) {
                        return;
                    }

                    event.data.results.filter(result => currentMinScore < result.avg)
                        .forEach(result => resultFromWrokers.push(result));

                    if (!currentMinScore || numberOfResults < resultFromWrokers.length) {
                        resultFromWrokers.sort((a, b) => b.avg - a.avg);
                        resultFromWrokers = resultFromWrokers.slice(0, numberOfResults);
                        currentMinScore = resultFromWrokers[resultFromWrokers.length - 1].avg;
                    }

                    if (processedTaskCount < conditions.length) {
                        postMessage();
                    } else {
                        resolve({
                            scoreWithRgbs: resultFromWrokers
                        });
                    }
                };

                postMessage();
            }
        });
    }
}
