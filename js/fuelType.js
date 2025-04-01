const id_fuelType = "#fuelTypeDiv"

const margin_fuelType = { top: 0, right: 0, bottom: 50, left: 50 },
    width_fuelType = 1024 - margin_fuelType.left - margin_fuelType.right,
    height_fuelType = 768 - margin_fuelType.top - margin_fuelType.bottom;


svg_fuelType = d3.select(id_fuelType)
    .append("svg")
    .attr("width", width_fuelType + margin_fuelType.left + margin_fuelType.right)
    .attr("height", height_fuelType + margin_fuelType.top + margin_fuelType.bottom + 10)
    .attr("viewBox", '0 0 ' + (width_fuelType + margin_fuelType.left + margin_fuelType.right) +
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
    
    
var x = d3.scaleBand().domain(d3.range(2012, 2023)).range([0, width_fuelType]).padding(1)
var y = d3.scaleLinear().domain([0, 7000]).range([0, height_fuelType])

function drawFuel()
{

    countryID = nameMap.get(document.getElementById("stackedNation").value)
    coso = d3.stack().keys(dataAll.columns.slice(2))(byGeo[countryID])
    area = d3.area()
        .x(function (d, i) { return x(+d.data.year); })
        .y0(function (d) { return y(d[0]); })
        .y1(function (d) { return y(d[1]); })
    svg_fuelType.selectAll(".stackArea").remove()
    stackedG = svg_fuelType.append("g")
    
    stackedG.selectAll(".stackArea").data(coso).join("path").attr("d", area).style("fill", d => stackedPalette.get(d.key)).attr("class", d => d.key + " stackArea")
        .on('mouseover', function (e, d) {
            stackedG.selectAll("path")
            .style("fill-opacity", "0.5").transition("selected")
            .duration(300)
            
            cat = d.key
            stackedG.selectAll("."+cat).style("stroke", "#000")
            .style("stroke-width", "2px").style("fill-opacity","1.0")
            .transition("selected").duration(300);
    
            tooltip_fuelType.transition("appear-box").duration(300)
            .style("opacity", "0.9")
            // TODO: categoria HH non so cosa sia, quindi il tooltip risutla orribile: trovare cosa o toglierla dai dati
            tooltip_fuelType.html("<span class='tooltiptext'>" + "<b> Category: " + cat +": "+stackedType.get(cat) +
                "</b></span>")
            .style("left", (e.pageX) + "px")
            .style("top", (e.pageY - 28) + "px");
        }).on("mouseout", function (e, d){
            stackedG.selectAll("path").style("stroke", "trasparent")
            .style("stroke-width", "0px").style("fill-opacity", "1")
            .transition("selected").duration(300)
        })
        
    svg_fuelType.selectAll("g").on('mouseleave', function (e, d) {
        tooltip_fuelType.transition("disappear-box").duration(300).style("opacity", "0.0")
    })

}    

var byGeo
var dataAll
d3.tsv("data/fuelType.tsv").then(function (data) {
    byGeo = groupBy(data, 'geo')
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
        .call(d3.axisLeft(y).tickValues([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]).tickFormat(d => d * 100 + '%'))
    d3.select("#stackedNation").style("position", "absolute").style("top", "auto")
    for (const nation of nameMap.keys()) {
        tmp = d3.select("#stackedNation").append("option").html(nation).attr("value", nation)
        if (nation == "Europe")
            tmp.attr("selected", true)
    };

    drawFuel()
})


