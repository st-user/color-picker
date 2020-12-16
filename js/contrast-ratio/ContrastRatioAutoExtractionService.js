export default class ContrastRatioAutoExtractionService {


    #workers;

    constructor() {
        this.#workers = [];
    }

    doService(targetColorLuminances, conditions, threadCount) {

        return new Promise((resolve, reject) => {

            let allResults = {};
            let processedTaskCount = 0;
            let postedTaskCount = 0;
            let error = false;

            // console.log(conditions);

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

                    const condition = conditions[postedTaskCount];
                    if (!condition) {
                        return;
                    }
                    postedTaskCount++;
                    worker.postMessage({
                        condition: condition,
                        targetColorLuminances: targetColorLuminances
                    });
                };

                worker.onmessage = event => {

                    if (error) {
                        return;
                    }

                    const eachDivisionResult = event.data.results;
                    const resultDivisions = Object.keys(eachDivisionResult).map(d => parseInt(d));
                    for (const divIndex of resultDivisions) {
                        const currentMax = allResults[divIndex];
                        const resultMax = eachDivisionResult[divIndex];
                        if (!currentMax || currentMax < resultMax) {
                            allResults[divIndex] = resultMax;
                        }
                    }
                    // console.log(`eachDivisionResult :: ${JSON.stringify(eachDivisionResult)}`);
                    processedTaskCount++;

                    if (processedTaskCount < conditions.length) {
                        postMessage();
                    } else {

                        const uniqueResults = [];
                        Object.values(allResults).forEach(result => {
                            for (const existingRgb of uniqueResults) {
                                if (existingRgb.r === result.r
                                        && existingRgb.g === result.g
                                        && existingRgb.b === result.b) {
                                    return;
                                }
                            }
                            uniqueResults.push(result);
                        });
                        uniqueResults.sort((a, b) => b.avg - a.avg);
                        // console.log(`end service :: ${JSON.stringify(uniqueResults)}`);

                        resolve({
                            scoreWithRgbs: uniqueResults
                        });
                    }
                };

                postMessage();
            }
        });
    }
}
