export default function StackedAreaChart(container) {
    // initialization
    let selected = null;
    let data;
    let xDomain;

    const margin = { top: 20, right: 20, bottom: 20, left: 50 };
    const width = 700 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3
    .select(container)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

    const graph = svg.append("g").classed(".chart-svg", true);

    svg
  .append("rect")
  .attr("x", 0)
  .attr("width", margin.left)
  .attr("y", 0)
  .attr("height", margin.top + height + margin.bottom - 15)
  .attr("fill", "rgb(255, 255, 255)");
    
    svg
  .append("rect")
  .attr("x", margin.left + width)
  .attr("width", margin.right)
  .attr("y", 0)
  .attr("height", margin.top + height + margin.bottom - 14)
  .attr("fill", "rgb(255, 255, 255)");

  const xScale = d3.scaleTime().range([1, width]);
  const yScale = d3.scaleLinear().range([height, 0]);
  const colorScale = d3.scaleOrdinal().range(d3.schemeCategory10);

  const xAxis = d3.axisBottom().scale(xScale);
  const yAxis = d3.axisLeft().ticks(3).scale(yScale);

  const xAxisUp = svg
    .append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(${margin.left}, ${margin.top + height})`)
    .call(xAxis);
  const yAxisUp = svg
    .append("g")
    .attr("class", "axis y-axis")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .call(yAxis);

  const area = d3
    .area()
    .x((d) => xScale(d.data.date) + margin.left)
    .y0((d) => yScale(d[0]) + margin.top)
    .y1((d) => yScale(d[1]) + margin.top);

	const tooltip = svg
    .append("text")
    .attr("class", ".tooltip")
    .attr("x", margin.left + 5)
    .attr("y", margin.top + 15);

  function update(tempData) {
    data = tempData;
    const keys = selected ? [selected] : data.columns.slice(1);
    var stack = d3.stack().keys(keys);
    var stackSeries = stack(data);

    const yMax = d3.max(stackSeries, (d) => d3.max(d, (d2) => d2[1]));
    xDomain
      ? xScale.domain(xDomain)
      : xScale.domain(d3.extent(data.map((d) => d.date)));
    yScale.domain([0, yMax]);
    colorScale.domain(data.columns.slice(1));

    xAxisUp.call(xAxis);
    yAxisUp.call(yAxis);

    const areas = graph
      .selectAll("path")
      .data(stackSeries)
      .join("path")
      .attr("fill", (d) => colorScale(d.key))
      .attr("d", area)
      .on("mouseleave", (l, d) => {
        if (!selected) tooltip.style("display", "none");
      })
      .on("mouseenter", (l, d) => {
        tooltip.style("display", "block").text(d.key);
      })
      .on("click", (l, d) => {
        if (selected === d.key) {
          selected = null;
        } else {
          selected = d.key;
        }
        update(data);
      });
  }

  function filterByDate(range) {
    xDomain = range;
    update(data);
  }

  return {
    update,
    filterByDate,
  };
}