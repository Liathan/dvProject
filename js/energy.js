const id_radar = "#radar"

const margin_stacked = { top: 0, right: 0, bottom: 50, left: 50 },
    width_stacked = 1024 - margin_stacked.left - margin_stacked.right,
    height_stacked = 768 - margin_stacked.top - margin_stacked.bottom;


svg_radar = d3.select(id_radar)
    .append("svg")
    .attr("width", width_stacked + margin_stacked.left + margin_stacked.right)
    .attr("height", height_stacked + margin_stacked.top + margin_stacked.bottom + 10)
    .attr("viewBox", '0 0 ' + (width_stacked + margin_stacked.left + margin_stacked.right) +
        ' ' + (height_stacked + margin_stacked.top + margin_stacked.bottom))
    .style("margin-top", "2%")
    .append("g")


radarSelect = d3.select("#radarSelect")
var pippo
d3.tsv("data/radar.tsv").then(function (data)
{
    console.log(data)
    pippo = data
})
