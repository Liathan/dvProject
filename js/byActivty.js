const id_stacked_percentage = "#stackedPercentage"

const margin_stacked = { top: 0, right: 0, bottom: 0, left: 0 },
    width_stacked = 1024 - margin_stacked.left - margin_stacked.right,
    height_stacked = 768 - margin_stacked.top - margin_stacked.bottom;


svg_stacked = d3.select(id_stacked_percentage)
    .append("svg")
    .attr("width", width_stacked + margin_stacked.left + margin_stacked.right)
    .attr("height", height_stacked + margin_stacked.top + margin_stacked.bottom)
    .attr("viewBox", '0 0 ' + (width_stacked + margin_stacked.left + margin_stacked.right) +
        ' ' + (height_stacked + margin_stacked.top + margin_stacked.bottom))
    .append("g")

y = d3.scaleLinear().domain([0, 1]).range([0, height_stacked])
var pippo
d3.csv("data/percentageTHS.csv").then(function (data) {
    pippo = data
    x = d3.scaleLinear().domain(d3.extent(data, d => d.year)).range([0, width_stacked])
    for (const nation of nameMap.keys()) {
        d3.select("#stackedNation").append("option").html(nation).attr("value", nation)
    };
    byGeo = groupBy(data, 'geo')
    coso = d3.stack().keys(data.columns.slice(2))(byGeo.IS)

    area = d3.area()
        .x(function(d, i) { return x(d.data.year); })
        .y0(function(d) { return y(d[0]); })
        .y1(function(d) { return y(d[1]); })

    color = d3.scaleOrdinal().domain(d3.union(coso.map(d => d.key[0]))).range(d3.schemeSpectral[11])
    svg_stacked.selectAll("path").data(coso).join("path").attr("d", area).style("fill", d => palette.get(d.key))

})


