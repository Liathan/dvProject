const id_stacked_percentage = "#stackedPercentage"

const margin_stacked = { top: 0, right: 0, bottom: 50, left: 50 },
    width_stacked = 1024 - margin_stacked.left - margin_stacked.right,
    height_stacked = 768 - margin_stacked.top - margin_stacked.bottom;


svg_stacked = d3.select(id_stacked_percentage)
    .append("svg")
    .attr("width", width_stacked + margin_stacked.left + margin_stacked.right)
    .attr("height", height_stacked + margin_stacked.top + margin_stacked.bottom)
    .attr("viewBox", '0 0 ' + (width_stacked + margin_stacked.left + margin_stacked.right) +
        ' ' + (height_stacked + margin_stacked.top + margin_stacked.bottom))
    .append("g")

y = d3.scaleLinear().domain([1, 0]).range([0, height_stacked])

var pippo
d3.csv("data/percentageTHS.csv").then(function (data) {
    pippo = data
    x = d3.scaleBand().domain(d3.range(2008, 2022)).range([0, width_stacked]).padding(1)
    byGeo = groupBy(data, 'geo')
    coso = d3.stack().keys(data.columns.slice(2))(byGeo.IS)

    area = d3.area()
        .x(function(d, i) { return x(+d.data.year); })
        .y0(function(d) { return y(d[0]); })
        .y1(function(d) { return y(d[1]); })

    svg_stacked.selectAll("path").data(coso).join("path").attr("d", area).style("fill", d => palette.get(d.key))

    svg_stacked.append("g")
    .attr("transform", `translate(0, ${height_stacked})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
        .data(x.domain())
        .style("text-anchor", "center")
        .style("font-family", "Fira Sans, sans-serif")
        .style("font-size", "12px")

    svg_stacked.append("g").attr("transform", 'translate(50, 0)')
    .call(d3.axisLeft(y).tickValues([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]).tickFormat(d => d*100 + '%'))

    for (const nation of nameMap.keys()) {
        d3.select("#stackedNation").append("option").html(nation).attr("value", nation)
    };

})


