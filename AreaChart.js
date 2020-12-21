const listeners = { brushed: null };


export default function AreaChart(container){

    // initialization
    const margin = { top: 20, right: 20, bottom: 20, left: 50 };
    const width = 700 - margin.left - margin.right;
    const height = 100 - margin.top - margin.bottom;

    const svg = d3
        .select(container)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);
    
    const graph = svg.append("g").classed(".chart-svg", true);

    const xScale = d3.scaleTime().range([0, width]);
    const yScale = d3.scaleLinear().range([height, 0]);

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

    const path = graph.append("path");

    var area = d3
    .area()
    .x((d) => xScale(d.date) + margin.left)
    .y0(yScale(0) + margin.top)
    .y1((d) => yScale(d.total) + margin.top);


    const brush = d3
    .brushX()
    .extent([
      [margin.left, margin.top],
      [width + margin.left, height + margin.top],
    ])
    .on("brush", brushed);

    graph.append("g").attr("class", "brush").call(brush);

    function brushed(event) {
        if (event.selection) {
        console.log("brushed", event.selection);
        const select = event.selection.map((d) => d - margin.left);
        listeners["brushed"](select.map(xScale.invert));
        }
    }

	function update(data){ 
        console.log(data.map((d) => d.total))

        xScale.domain(d3.extent(data.map((d) => d.date)));
        yScale.domain([0, d3.max(data, (d) => d.total)]);

        xAxisUp.call(xAxis);
        yAxisUp.call(yAxis);

        path.datum(data).attr("fill", "orange").attr("d", area);
    }
    
    function on(event, listener) {
        listeners[event] = listener;
    }

	return {
        update, // ES6 shorthand for "update": update
        on,
	};
}