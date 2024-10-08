const id_map_Abs = "#ghg_map_Abs"
const id_map_PC = "#ghg_map_PC"


const margin_map = {top: 0, right: 0, bottom: 0, left: 0},
    width_map = 1024 - margin_map.left - margin_map.right,
    height_map = 768 - margin_map.top - margin_map.bottom;

const scaleFactor_map = 1

var projection = d3.geoMercator()



var tonnes = []
var colorScale = []

const svg_map_Abs = d3.select(id_map_Abs)
    .append("svg")
    .attr("width", width_map + margin_map.left + margin_map.right)
    .attr("height", height_map + margin_map.top + margin_map.bottom)
    .attr("viewBox", '0 0 ' + (width_map + margin_map.left + margin_map.right) +
        ' ' + (height_map + margin_map.top + margin_map.bottom))
    .append("g")
const svg_map_PC = d3.select(id_map_PC)
    .append("svg")
    .attr("width", width_map + margin_map.left + margin_map.right)
    .attr("height", height_map + margin_map.top + margin_map.bottom)
    .attr("viewBox", '0 0 ' + (width_map + margin_map.left + margin_map.right) +
        ' ' + (height_map + margin_map.top + margin_map.bottom))
    .append("g")

svg_map = [svg_map_Abs, svg_map_PC]
labels = ["labelAbs", "labelPC"]
function redrawMap(idx, map)
{
    curYear = years[+idx]
    nameArr.forEach( (el,i) => {
        svg_map[map].select("."+el)
        .attr("fill", colorScale[map](tonnes[map].get(curYear)[i]))
    });
    svg_map[map].selectAll(".ND").attr("fill", "#737373")
    d3.select("#"+labels[map]).text(curYear)
}
var isPlaying = [false, false]
var intervalID = []
var playButton = ["#buttonAbs","#buttonPC"]
var select = [document.getElementById("selectQuarter_Abs"), document.getElementById("selectQuarter_PC")]

function tick(map)
{
    var value = +select[map].value +1
    if (value == years.length -1)
    {
        isPlaying[map] = !isPlaying[map]
        clearInterval(intervalID[map])
        d3.select(playButton[map]).select("polygon").attr("opacity","1")
        d3.select(playButton[map]).selectAll("rect").attr("opacity","0")
    }
    select[map].value = +value
    select[map].dispatchEvent(new Event("change"))
}

function slider(map)
{
    if(isPlaying[map])
    {
        clearInterval(intervalID[map])
        d3.select(playButton[map]).select("polygon").attr("opacity","1")
        d3.select(playButton[map]).selectAll("rect").attr("opacity","0")
    }
    else
    {
        d3.select(playButton[map]).select("polygon").attr("opacity","0")
        d3.select(playButton[map]).selectAll("rect").attr("opacity","1")
        var idx = +select[map].value
        if(idx == years.length)
            select[map].value = 0
        intervalID[map] = setInterval(tick, 300, map)
        select[map].value = String(idx)
    }
    isPlaying[map] = !isPlaying[map]
}
var maxPC = 0
var minPC = 0
var maxAbs = 0
var minAbs = 0

const tooltip_ABS = d3.select(id_map_Abs).append("div")
    .attr("class", "tooltip")
    .style("font-size", "14px")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("opacity", 0);

const tooltip_PC = d3.select(id_map_PC).append("div")
    .attr("class", "tooltip")
    .style("font-size", "14px")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("opacity", 0);

Promise.all([
    d3.json("data/europe_.geojson"),
    d3.csv("data/perCapitaByYear.csv").then( function (d) {
        
        tonnesPC = new Map()
        d.forEach(el => {
            tmp = Object.values(el).slice(1)
            M = Math.max(...tmp)
            if(M > maxPC)
                maxPC = M
            m = Math.min(...tmp)
            if(m < maxPC)
                minPC = m
            tonnesPC.set(el.year, tmp)
        });
        tonnes[1] = tonnesPC
        colorScale[1] = d3.scaleSequential([0, maxPC], d3.interpolateReds)
    }),
    d3.csv("data/absoluteByYear.csv").then( function (d) {
        tonnesAbs = new Map()
        d.forEach(el => {
            tmp = Object.values(el).slice(1)
            M = Math.max(...tmp)
            if(M > maxAbs)
                maxAbs = M
            m = Math.min(...tmp)
            if(m < maxAbs)
                minAbs = m
            tonnesAbs.set(el.year, tmp)
        });
        tonnes[0] = tonnesAbs
        colorScale[0] = d3.scaleSequential([0, maxAbs], d3.interpolateReds)
    })
]
    ).then( function (loadData){
        let topo = loadData[0]
                
        projection.scale(650)
        projection.clipExtent([[0, 0], [width_map / 4 *3 , height_map]])
        projection.center([16.39333,63])
        // projection.translate(0, 0)
        d3.selectAll("svg").select("g").append("g")
        .selectAll("path")
        .data(topo.features)
        .join("path")
            .attr("d", d3.geoPath().projection(projection))
            // .attr("fill", function (d) { if (nameArr.includes(d.properties.name)) return "red"; else return "blue"})
            .attr("class", (d) => (nameMap.get(d.properties.name) || "ND") + " "+ d.properties.name)
            .style("fill-opacity", "0.9")
            .style("stroke", "black")
            .style("stroke-width", "1px");

        legendHeight = height_map - 50
        
        svg_map_Abs.select("g").append("rect").attr("id", "legendAbs")
            .attr("x", width_map /4 * 3 + 20).attr("width", 50)
            .attr("height", legendHeight).attr("y", 25).attr("fill", "url(#grAbs)")
        svg_map_PC.select("g").append("rect").attr("id", "legendPC")
            .attr("x", width_map /4 * 3 + 20).attr("width", 50)
            .attr("height", legendHeight).attr("y", 25).attr("fill", "url(#grPC)")

        d3.selectAll("svg").select("g").selectAll("line").data([0,1,2,3,4,5]).join("line")
        .attr("x1", width_map /4 * 3 +70).attr("x2", width_map /4 * 3 +90)
        .attr("y1", (d) => legendHeight * d / 5 +25).attr("y2", (d) => legendHeight * d / 5 +25)
        .attr("stroke", "black")
        
        svg_map_Abs.append("text").attr("y", 60).attr("font-size", "4em").attr("x","20").attr("id","labelAbs")
        svg_map_Abs.append("g").attr("id","buttonAbs").append("polygon").attr("points", "160,20 200,40 160,60")
        d3.select("#buttonAbs").append("rect").attr("x", "160").attr("y","20").attr("width",15).attr("height",40).attr("opacity","0")
        d3.select("#buttonAbs").append("rect").attr("x", "180").attr("y","20").attr("width",15).attr("height",40).attr("opacity","0")
        
        
        svg_map_PC.append("text").attr("y", 60).attr("font-size", "4em").attr("x","20").attr("id","labelPC")
        svg_map_PC.append("g").attr("id","buttonPC").append("polygon").attr("points", "160,20 200,40 160,60")
        d3.select("#buttonPC").append("rect").attr("x", "160").attr("y","20").attr("width",15).attr("height",40).attr("opacity","0")
        d3.select("#buttonPC").append("rect").attr("x", "180").attr("y","20").attr("width",15).attr("height",40).attr("opacity","0")

        AbsStep = (maxAbs - minAbs) / 5
        AbsStops = [0, 1, 2, 3, 4, 5].map((d) => colorScale[0](minAbs + AbsStep * d))
        
        PCStep = (maxPC - minPC) / 5
        PCStops = [0, 1, 2, 3, 4, 5].map((d) => colorScale[1](minPC + PCStep * d))
        
        svg_map_Abs.select("g").selectAll("text").data([0,1,2,3,4,5]).join("text").text((d) => (minAbs + d * AbsStep).toFixed(2) + " CO2e")
        .attr("x", width_map / 4* 3 + 90).attr("y", (d) => legendHeight * (5-d) / 5 +25 + 5)
        svg_map_PC.select("g").selectAll("text").data([0,1,2,3,4,5]).join("text").text((d) => (minPC + d * PCStep).toFixed(2) + " CO2e per capita")
        .attr("x", width_map / 4* 3 + 90).attr("y", (d) => legendHeight * (5-d) / 5 +25 + 5)
        
        svg_map_Abs.append("defs").append("linearGradient").attr("id", "grAbs")
        .attr("x1", 0).attr("x2", 0).attr("y1", 1).attr("y2", 0)
        .selectAll("stop").data(AbsStops).join("stop").attr("offset", (d, i) => i / 5).attr("stop-color", (d) => d)

        svg_map_PC.append("defs").append("linearGradient").attr("id", "grPC")
        .attr("x1", 0).attr("x2", 0).attr("y1", 1).attr("y2", 0)
        .selectAll("stop").data(PCStops).join("stop").attr("offset", (d, i) => i / 5).attr("stop-color", (d) => d)

        svg_map_Abs.join("g").selectAll("path")
        .on("mouseover", function (e, d){
            svg_map_Abs.selectAll("path").style("stroke", "transparent")
            .style("fill-opacity", "0.5").transition("selected")
            .duration(300)

            var name = d.properties.name
            idx = nameArr.indexOf(nameMap.get(name))
            value = tonnes[0].get(years[+select[0].value])[idx] || "Extra EU Country"

            svg_map_Abs.selectAll("."+name).style("stroke", "#000")
            .style("stroke-width", "2px").style("fill-opacity","1.0")
            .transition("selected").duration(300);

            tooltip_ABS.transition("appear-box").duration(300)
            .style("opacity", "0.9")

            tooltip_ABS.html("<span class='tooltiptext'>" + "<b>" + name +
                "</b><br>" + "CO2e tonnes: " + value + "</span>")
            .style("left", (e.pageX) + "px")
            .style("top", (e.pageY - 28) + "px");


        }).on("mouseout", function (e, d){
            svg_map_Abs.selectAll("path").style("stroke", "black")
            .style("stroke-width", "1px").style("fill-opacity", "0.9")
            .transition("selected").duration(300)
        })
        svg_map_PC.join("g").selectAll("path")
        .on("mouseover", function (e, d){
            svg_map_PC.selectAll("path").style("stroke", "transparent")
            .style("fill-opacity", "0.5").transition("selected")
            .duration(300)

            var name = d.properties.name
            idx = nameArr.indexOf(nameMap.get(name))
            value = tonnes[1].get(years[+select[1].value])[idx] || "Extra EU Country"

            svg_map_PC.selectAll("."+name).style("stroke", "#000")
            .style("stroke-width", "2px").style("fill-opacity","1.0")
            .transition("selected").duration(300);

            tooltip_PC.transition("appear-box").duration(300)
            .style("opacity", "0.9")

            tooltip_PC.html("<span class='tooltiptext'>" + "<b>" + name +
                "</b><br>" + "CO2e tonnes per capita: " + value + "</span>")
            .style("left", (e.pageX) + "px")
            .style("top", (e.pageY - 28) + "px");


        }).on("mouseout", function (e, d){
            svg_map_PC.selectAll("path").style("stroke", "black")
            .style("stroke-width", "1px").style("fill-opacity", "0.9")
            .transition("selected").duration(300)
        })
        
        svg_map_Abs.selectAll("g").on("mouseleave", function (e,d){
            tooltip_ABS.transition("disappear-box").duration(300).style("opacity", "0.0")
        })
        
        svg_map_PC.selectAll("g").on("mouseleave", function (e,d){
            tooltip_PC.transition("disappear-box").duration(300).style("opacity", "0.0")
        })
        redrawMap(0,0)
        redrawMap(0,1)
        d3.select("#selectQuarter_Abs").on("change", function (d) {
            redrawMap(this.value, 0)
        })
        d3.select("#selectQuarter_PC").on("change", function (d) {
            redrawMap(this.value, 1)
        })
        // playButton[0].onclick = () => slider(0)
        // playButton[1].onclick = () => slider(1)
        d3.select("#buttonAbs").on("click", () => slider(0))
        d3.select("#buttonPC").on("click", () => slider(1))
    })