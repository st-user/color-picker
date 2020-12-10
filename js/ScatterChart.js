import * as d3 from 'd3';

const AREA_WIDTH = 360;
const AREA_HEIGHT = 360;
const MARGIN = { TOP: 10, RIGHT: 30, BOTTOM: 50, LEFT: 60 };
const WIDTH = AREA_WIDTH - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = AREA_HEIGHT - MARGIN.TOP - MARGIN.BOTTOM;
const X_DOMAIN = [0, 100];
const Y_DOMAIN = [0, 100];
const TICKS_COUNT_X = 10;
const TICKS_COUNT_Y = 10;
const CIRCLE_R = 8;

const eachToolTipLineTemplate = datum => {
    return `
    <div class="colorDesignChartTooltipLine">
      <div>
        <span class="colorDesignChartTooltipLineColor" style="background-color: ${datum.colorCode}"></span>
        <span class="colorDesignChartTooltipLineColorCode font-small">${datum.colorCode}</span>
      </div>
      <span class="colorDesignChartTooltipLineHsv font-small">hsv(${datum.hsv.h}°,${datum.hsv.s}%,${datum.hsv.v}%)</span>
    </div>
  `;
};

export default class ScatterChart {

  #svg;
  #tooltip;
  #x;
  #y;

  #dataMap;
  #tooltipMap;

  constructor() {

      const svg = d3.select('#colorDesignChart')
    	  .append('svg')
          .attr('width', AREA_WIDTH)
          .attr('height', AREA_HEIGHT)
          .append('g')
          .attr('transform', `translate(${MARGIN.LEFT},${MARGIN.TOP})`);

      const x = d3.scaleLinear()
          .domain(X_DOMAIN)
          .range([0, WIDTH]);
      svg.append('g')
          .attr('transform', `translate(0, ${HEIGHT})`)
          .call(d3.axisBottom(x).ticks(TICKS_COUNT_X));

      svg.append('text')
          .attr('transform', `translate(${WIDTH / 2}, ${HEIGHT + MARGIN.TOP + 30})`)
          .style('text-anchor', 'middel')
          .text('彩度(S)');

      let y = d3.scaleLinear()
          .domain(Y_DOMAIN)
          .range([HEIGHT, 0]);
      svg.append('g')
          .call(d3.axisLeft(y).ticks(TICKS_COUNT_Y));

      svg.append('text')
          .attr('transform', 'rotate(-90)')
          .attr('y', -40)
          .attr('x', 0 - HEIGHT / 2)
          .style('text-anchor', 'middle')
          .text('明度(V)');

      const xTickInterval = (X_DOMAIN[1] - X_DOMAIN[0]) / TICKS_COUNT_X;
      for (let grid_i = 1; grid_i < TICKS_COUNT_X; grid_i++) {
          svg.append('g')
              .append('line')
              .attr('x1', x(grid_i * xTickInterval))
              .attr('y1', 0)
              .attr('x2', x(grid_i * xTickInterval))
              .attr('y2', HEIGHT)
              .attr('stroke', '#111111')
              .style('opacity', 0.1);
      }

      const yTickInterval = (Y_DOMAIN[1] - Y_DOMAIN[0]) / TICKS_COUNT_Y;
      for (let grid_i = 1; grid_i < TICKS_COUNT_Y; grid_i++) {
          svg.append('g')
              .append('line')
              .attr('x1', 0)
              .attr('y1', y(grid_i * yTickInterval))
              .attr('x2', WIDTH)
              .attr('y2', y(grid_i * yTickInterval))
              .attr('stroke', '#111111')
              .style('opacity', 0.1);
      }


      const tooltip = d3.select('#colorDesignChartTooltip')
          .style('display', 'none');

      this.#svg = svg;
      this.#tooltip = tooltip;
      this.#x = x;
      this.#y = y;
      this.#dataMap = {};
      this.#tooltipMap = {};
  }

  appendData(datum) {

      this.#dataMap[datum.id] = datum;
      const data = Object.values(this.#dataMap);

      this.#svg.selectAll('circle')
          .data(data)
          .enter()
          .append('circle')
          .attr('fill', d => d['colorCode'])
          .attr('cy', d => this.#y(d.hsv.v))
          .attr('cx', d => this.#x(d.hsv.s))
          .attr('r', CIRCLE_R)
          .attr('stroke', '#333334')
          .attr('stroke-width', 1)
          .attr('class', 'colorDesignChartCircle')
          .on('mouseover', (e, d) => this.#mouseover(e, d))
          .on('mousemove', (e, d) => this.#mousemove(e, d))
          .on('mouseleave', (e, d) => this.#mouseleave(e, d));
  }

  removeData(id) {

      delete this.#dataMap[id];
      delete this.#tooltipMap[id];

      this.#svg.selectAll('circle')
          .filter(d => d.id === id)
          .remove();
  }

  #mouseover(event, datum) {
      this.#tooltip.style('display', 'block');
  }

  #mousemove(event, datum) {

      let toolTipHtml = this.#tooltipMap[datum.id];

      if (!toolTipHtml) {
          const collectOverlappedCircle = () => {
              const data = Object.values(this.#dataMap);
              const squaredR = CIRCLE_R * CIRCLE_R;
              const dataGroup = [];
              for (const existingDatum of data) {
                  const squaredDistance = Math.pow(existingDatum.hsv.s - datum.hsv.s, 2)
                            + Math.pow(existingDatum.hsv.v - datum.hsv.v, 2);
                  if (squaredDistance < squaredR) {
                      dataGroup.push(existingDatum);
                  }
              }
              return dataGroup;
          };
          const dataGroup = collectOverlappedCircle();
          toolTipHtml = '';
          for(const row of dataGroup) {
              toolTipHtml += eachToolTipLineTemplate(row);
          }
          this.#tooltipMap[datum.id] = toolTipHtml;
      }

      this.#tooltip
          .html(toolTipHtml)
          .style('left', (this.#x(datum.hsv.s)+90) + 'px')
          .style('top', this.#y(datum.hsv.v) + 'px');
  }

  #mouseleave(event, datum) {
      this.#tooltip.transition()
          .duration(200)
          .style('display', 'none');
  }
}
