const id_radar = "#radar"

const margin_radar = { top: 70, right: 20, bottom: 70, left: 20},
    width_radar = 1024 - margin_radar.left - margin_radar.right,
    height_radar = 768 - margin_radar.top - margin_radar.bottom;


svg_radar = d3.select(id_radar)
    .append("svg")
    .attr("width", width_radar + margin_radar.left + margin_radar.right)
    .attr("height", height_radar + margin_radar.top + margin_radar.bottom + 10)
    .attr("viewBox", '0 0 ' + (width_radar + margin_radar.left + margin_radar.right) +
        ' ' + (height_radar + margin_radar.top + margin_radar.bottom))
    .style("margin-top", "2%")
    .append("g")
    .attr("transform", `translate(${margin_radar.left}, ${margin_radar.top})`);


radarSelect = d3.select("#radarSelect").style("position", "absolute").style("top", "auto")
for (const nation of nameMap.keys()) {
    tmp = d3.select("#radarSelect").append("option").html(nation).attr("value", nation)
    if (nation == "Europe")
        tmp.attr("selected", true)
};

var byCountry
radius = height_radar / 2
maxDom = 100
numAxis = 6
var scale = d3.scaleLinear().domain([0, maxDom]).range([1/numAxis * radius, radius])
var angle = 2 * Math.PI / (years.length -2)
xCoord = (l,i) => scale(l) * Math.cos(angle * i - Math.PI / 2)
yCoord = (l,i) => scale(l) * Math.sin(angle * i - Math.PI / 2)

function drawRadar()
{
    svg_radar.selectAll("polygon").remove()

    countryID = nameMap.get(document.getElementById("radarSelect").value)
    tot = byCountry[countryID].filter(d => d.siec == "TOTAL")[0]


    byCountry[countryID].forEach(el => {
        if (el.siec == "TOTAL")
            return
        svg_radar.append("g")
        .attr("transform", `translate(${width_radar / 2}, ${height_radar / 2})`)
        .append("polygon")
        .data([Object.keys(el).filter(d => d != 'geo' && d != 'siec')])
        .attr("points", d => d.reduce((acc, dd) => acc + xCoord(+el[dd] / tot[dd] * 100, (+dd - 2012)) +","+yCoord(+el[dd] / tot[dd] * 100, (+dd - 2012)) + " ", ""))
        .attr("fill-opacity", "0.075")
        .attr("stroke",radarPalette.get(el.siec) )
        .attr("stroke-width", "2px")
        .attr("fill",radarPalette.get(el.siec))
    });
    // svg_radar.append("g")
    // .append("polygons")
}

d3.tsv("data/radar.tsv").then(function (data)
{
    byCountry = groupBy(data, 'geo')
    
    svg_radar.append("g")
    .selectAll("rect")
    .data(radarType.keys().toArray().filter(el => el != "TOTAL"))
    .join("rect")
    .attr("x", 0)
    .attr("y", (d,i) => i *25)
    .attr("width", 20)
    .attr("height", 20)
    .attr("fill", d => radarPalette.get(d))

    svg_radar.append("g")
    .selectAll(".legendLabel")
    .data(radarType.keys().toArray().filter(el => el != "TOTAL"))
    .join("text")
    .attr("x", 25)
    .attr("y", (d,i) => i *25 + 20)
    .html(d => radarType.get(d))

    svg_radar.selectAll(".levels")
    .data(d3.range(1, numAxis+1))
    .join("circle")
    .attr("r", (d) => d / numAxis * radius)
    .attr("cx", width_radar / 2)
    .attr("cy", height_radar / 2)
    .style("fill", "#CDCDCD")
    .style("stroke", "#CDCDCD")
    .style("fill-opacity", 0.1)

    svg_radar.selectAll(".axisLabel")
    .data(d3.range(numAxis))
    .join("text")
    .attr("x", width_radar / 2)
    .attr("y", d => (numAxis - d -1 ) / numAxis * radius)
    .text(d => d * 20 + "%")

    var axis = svg_radar.selectAll(".axis")
    .data(years.slice(2))
    .join("g")
    .attr("transform", `translate(${width_radar / 2}, ${height_radar / 2})`)
    .attr("class", "axis")
    
    axis.append("line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", (d, i) => xCoord(maxDom, i))
    .attr("y2", (d, i) => yCoord(maxDom, i))
    .attr("class", "line")
    .style("stroke", "lightgrey")
    .style("stroke-width", "2px")

    axis.append("text")
    .attr("class", "text")
    .attr("text-anchor", "middle")
    .attr("x", (d, i) => xCoord(maxDom, i) * 1.15)
    .attr("y", (d, i) => yCoord(maxDom, i) * 1.15)
    .text(d => d)

    drawRadar()
})
