const RgbUtil = (() => {


    return {

        decToR: dec => dec >> 16,
        decToG: dec => (dec >> 8) & 255,
        decToB: dec => dec & 255,

        divideSRGBSpace: unitCount => {

            const totalSRGBCount = 256 * 256 * 256;
            const unit = Math.floor(totalSRGBCount / unitCount) + 1;
            const ret = [];
            for(let i = 0; i < unitCount; i++) {
                const start = i * unit;
                let end = (i + 1) * unit;
                if (totalSRGBCount <= end) {
                    end = totalSRGBCount;
                    ret.push([ start, end ]);
                    break;
                }
                ret.push([ start, end ]);
            }

            return ret;
        }

    };

})();

export default RgbUtil;
