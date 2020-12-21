import AreaChart from './AreaChart.js';
import StackedAreaChart from './StackedAreaChart.js';

d3.csv('unemployment.csv', d3.autoType).then(data=>{
    console.log(data);

    data.map(
        (d) =>
          (d.total = Object.values(d)
            .slice(1)
            .reduce((a, b) => a + b, 0))
    );

    const areaChart1 = AreaChart(".chart-container1");
    areaChart1.update(data);

    const stackedAreaChart = StackedAreaChart(".chart-container2");
    

    stackedAreaChart.update(data);

    areaChart1.on("brushed", (range)=>{
        stackedAreaChart.filterByDate(range);
    })
    

});