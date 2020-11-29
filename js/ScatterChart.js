import * as d3 from "d3";

const AREA_WIDTH = 360;
const AREA_HEIGHT = 360;
const MARGIN = { TOP: 10, RIGHT: 30, BOTTOM: 50, LEFT: 60 };
const WIDTH = AREA_WIDTH - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = AREA_HEIGHT - MARGIN.TOP - MARGIN.BOTTOM;

export default class ScatterChart {

  #svg;
  #tooltip;
  #x;
  #y;

  #dataMap;

  constructor() {

    const svg = d3.select('#colorDesignChart')
    							.append('svg')
                  .attr('width', AREA_WIDTH)
                  .attr('height', AREA_HEIGHT)
                  .append('g')
                  .attr('transform', `translate(${MARGIN.LEFT},${MARGIN.TOP})`);

    const x = d3.scaleLinear()
                  .domain([0, 100])
                  .range([0, WIDTH]);
    svg.append('g')
         .attr('transform', `translate(0, ${HEIGHT})`)
         .call(d3.axisBottom(x));
    svg.append('text')
         .attr('transform', `translate(${WIDTH / 2}, ${HEIGHT + MARGIN.TOP + 30})`)
         .style('text-anchor', 'middel')
         .text('彩度(S)');

    let y = d3.scaleLinear()
                .domain([0, 100])
                .range([HEIGHT, 0]);
    svg.append('g')
          .call(d3.axisLeft(y));
    svg.append('text')
         .attr('transform', 'rotate(-90)')
         .attr('y', -40)
         .attr('x', 0 - HEIGHT / 2)
         .style('text-anchor', 'middle')
         .text('明度(V)');

    const tooltip = d3.select('#colorDesignChart')
                        .append('div')
                        .style('opacity', 0)
                        .attr('class', 'tooltip')
                        .style('background-color', 'white')
                        .style('border', 'solid')
                        .style('border-width', '1px')
                        .style('border-radius', '5px')
                        .style('padding', '10px');

    this.#svg = svg;
    this.#tooltip = tooltip;
    this.#x = x;
    this.#y = y;
    this.#dataMap = {};
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
               .attr('r', 8)
               .attr('opacity', 0.7)
               .on('mouseover', (e, d) => this.#mouseover(e, d))
               .on('mousemove', (e, d) => this.#mousemove(e, d))
               .on('mouseleave', (e, d) => this.#mouseleave(e, d));
  }

  removeData(id) {

    delete this.#dataMap[id];

    this.#svg.selectAll('circle')
               .filter(d => d.id === id)
               .remove();
  }

  #mouseover(event, data) {
    console.log(`over ${data.colorCode}`);
    this.#tooltip.style('opacity', 1);
  }

  #mousemove(event, data) {
    console.log(`over ${data.colorCode}`);
    this.#tooltip
            .html(data.colorCode)
            .style('position', 'absolute')
            .style('left', (this.#x(data.hsv.s)+90) + 'px')
            .style('top', this.#y(data.hsv.v) + 'px');
  }

  #mouseleave(event, data) {
    console.log(`over ${data.colorCode}`);
    this.#tooltip.transition()
                   .duration(200)
                   .style('opacity', 0);
  }
}
