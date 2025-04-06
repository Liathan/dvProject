const id_fuelType = "#fuelTypeDiv"

const margin_fuelType = { top: 0, right: 0, bottom: 50, left: 50 },
    width_fuelType = 1024 - margin_fuelType.left - margin_fuelType.right,
    height_fuelType = 768 - margin_fuelType.top - margin_fuelType.bottom;


svg_fuelType = d3.select(id_fuelType)
    .append("svg")
    .attr("width", width_fuelType + margin_fuelType.left + margin_fuelType.right)
    .attr("height", height_fuelType + margin_fuelType.top + margin_fuelType.bottom + 10)
    .attr("viewBox", '-50 -10 ' + (width_fuelType + margin_fuelType.left + margin_fuelType.right + 200) +
        ' ' + (height_fuelType + margin_fuelType.top + margin_fuelType.bottom))
    .style("margin-top", "2%")
    .append("g")

    
const tooltip_fuelType = d3.select(id_fuelType).append("div")
    .attr("class", "tooltip")
    .style("font-size", "14px")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("opacity", 0);
    
    
var x = d3.scaleBand().domain(d3.range(2012, 2024)).range([0, width_fuelType]).padding(1)
var y = d3.scaleLinear().domain([7000, 0]).range([0, height_fuelType])

var bySiec
lineData = new Map()
nameMap.values().filter(d => d != "EU27_2020").forEach(d => lineData.set(d, []))
console.log("hhhh", lineData.keys().toArray())

line = d3.line().x(function (d){console.log(d, +d[0], x(+d[0])); return x(+d[0])}).y(function (d){console.log("YY", d, +d[1], y(+d[1])); return y(+d[1])})
function drawFuel()
{
    svg_fuelType.selectAll(".line").remove()
    
    lineData.keys().forEach(d => lineData.set(d, []))
    siec = fuelSiec.get(document.getElementById("fuelSelect").value)
    bySiec[siec].filter(d => d.geo != "EU27_2020").forEach(d => lineData.set(d.geo, Object.entries(d).filter(obj => obj[0] != "siec" && obj[0] != "geo")))

    lineData.keys().forEach(function (ld)
    {
        svg_fuelType.append("g")
        .append("path")
        .attr("stroke", namePalette.get(ld))
        .attr("stroke-widht", 1.5)
        .attr("d", line(lineData.get(ld)))
        .attr("fill", "transparent")
        .attr("class", "line")

    })

}    

var dataAll
d3.tsv("data/fuelType.tsv").then(function (data) {
    bySiec = groupBy(data, 'siec')
    dataAll = data

    svg_fuelType.append("g")
        .attr("transform", `translate(0, ${height_fuelType})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .data(x.domain())
        .style("text-anchor", "center")
        .style("font-family", "Fira Sans, sans-serif")
        .style("font-size", "12px")

    svg_fuelType.append("g").attr("transform", 'translate(50, 0)')
        .call(d3.axisLeft(y).tickValues([1000, 2000, 3000, 4000, 5000, 6000, 7000]).tickFormat(d => d + ' KTOE'))
    d3.select("#fuelSelect").style("position", "absolute").style("right", "auto")
    
    for (const siec of fuelSiec.keys()) {
        d3.select("#fuelSelect").append("option").html(fuelSiec.get(siec)).attr("value", siec)
    };

    svg_fuelType.append("g").selectAll(".legend")
    .data(namePalette.keys()).join("rect").attr("x", (d,i) => x(2023) + 100).attr("y", (d,i) => i * 25)
    .attr("width", "20").attr("height","20").attr("fill", d => namePalette.get(d))

    svg_fuelType.append("g")
    .selectAll(".legendLabel")
    .data(nameMap.keys().toArray())
    .join("text")
    .attr("x", x(2023) + 130)
    .attr("y", (d,i) => i *25 + 20)
    .html(d => d)
    .on("mouseover", function (e, d) {
        // svg_fuelType.selectAll(".radarLine")
        // .attr("fill-opacity", "0.00")
        // .attr("stroke-width", "0px")
        
        // svg_fuelType.select("."+d)
        // .attr("fill-opacity", "0.9")
        // .attr("stroke-width", "3px")

        // console.log("aaaa")
    })
    .on("mouseout", function(e,d){
        // svg_fuelType.selectAll(".radarLine")
        // .attr("fill-opacity", "0.075")
        // .attr("stroke-width", "2px")
    })

    drawFuel()
})


