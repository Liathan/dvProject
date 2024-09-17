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
var pippo

svg_map = [svg_map_Abs, svg_map_PC]

function redrawMap(idx, map)
{
    nameArr.forEach( (el,i) => {
        svg_map[map].select("."+el)
        .attr("fill", colorScale[map](tonnes[map].get(quarters[+idx])[i]))
    });
    svg_map[map].selectAll(".ND").attr("fill", "#737373")
}
var isPlaying = false
var intervalID = []
var playButton = [document.getElementById("playButton_Abs"), document.getElementById("playButton_PC")]
var select = [document.getElementById("selectQuarter_Abs"), document.getElementById("selectQuarter_PC")]

function tick(map)
{
    var value = +select[map].value +1
    if (value == quarters.length -1)
    {
        isPlaying[map] = !isPlaying[map]
        clearInterval(intervalID[map])
        playButton[map].innerHTML = "<i class='fa fa-play'></i>"
    }
    select[map].value = +value
    select[map].dispatchEvent(new Event("change"))
}

function slider(map)
{
    if(isPlaying)
    {
        clearInterval(intervalID[map])
        playButton[map].innerHTML = "<i class='fa fa-play'></i>"
    }
    else
    {
        var idx = +select[map].value +1
        if(idx == quarters.length)
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

Promise.all([
    d3.json("../data/europe_.geojson"),
    d3.csv("../data/perCapita.csv").then( function (d) {
        
        tonnesPC = new Map()
        d.forEach(el => {
            tmp = Object.values(el).slice(1)
            M = Math.max(...tmp)
            if(M > maxPC)
                maxPC = M
            m = Math.min(...tmp)
            if(m < maxPC)
                minPC = m
            tonnesPC.set(el.quarter, tmp)
        });
        tonnes[1] = tonnesPC
        colorScale[1] = d3.scaleSequential([0, maxPC], d3.interpolateReds)
    }),
    d3.csv("../data/absolute.csv").then( function (d) {
        tonnesAbs = new Map()
        d.forEach(el => {
            tmp = Object.values(el).slice(1)
            M = Math.max(...tmp)
            if(M > maxAbs)
                maxAbs = M
            m = Math.min(...tmp)
            if(m < maxAbs)
                minAbs = m
            tonnesAbs.set(el.quarter, tmp)
        });
        tonnes[0] = tonnesAbs
        colorScale[0] = d3.scaleSequential([0, maxAbs], d3.interpolateReds)
        console.log(maxAbs)
    })
]
    ).then( function (loadData){
        let topo = loadData[0]
                
        projection.scale(650)
        projection.clipExtent([[0, 0], [width_map / 4 *3 , height_map]])
        projection.center([16.39333,63])
        // projection.translate(0, 0)
        pippo = loadData
        d3.selectAll("svg").select("g").append("g")
        .selectAll("path")
        .data(topo.features)
        .join("path")
            .attr("d", d3.geoPath().projection(projection))
            // .attr("fill", function (d) { if (nameArr.includes(d.properties.name)) return "red"; else return "blue"})
            .attr("class", (d) => nameMap.get(d.properties.name) || "ND")
            .style("fill-opacity", "0.9")
            .style("stroke", "white")
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
        
        AbsStep = (maxAbs - minAbs) / 5
        AbsStops = [0, 1, 2, 3, 4, 5].map((d) => colorScale[0](minAbs + AbsStep * d))
        
        PCStep = (maxPC - minPC) / 5
        PCStops = [0, 1, 2, 3, 4, 5].map((d) => colorScale[1](minPC + PCStep * d))
        
        svg_map_Abs.select("g").selectAll("text").data([0,1,2,3,4,5]).join("text").text((d) => (minAbs + d * AbsStep).toFixed(2) + " CO2e")
        .attr("x", width_map / 4* 3 + 90).attr("y", (d) => legendHeight * d / 5 +25 + 5)
        svg_map_PC.select("g").selectAll("text").data([0,1,2,3,4,5]).join("text").text((d) => (minPC + d * PCStep).toFixed(2) + " CO2e per capita")
        .attr("x", width_map / 4* 3 + 90).attr("y", (d) => legendHeight * d / 5 +25 + 5)
        
        svg_map_Abs.append("defs").append("linearGradient").attr("id", "grAbs")
        .attr("x1", 0).attr("x2", 0).attr("y1", 1).attr("y2", 0)
        .selectAll("stop").data(AbsStops).join("stop").attr("offset", (d, i) => i / 5).attr("stop-color", (d) => d)

        svg_map_PC.append("defs").append("linearGradient").attr("id", "grPC")
        .attr("x1", 0).attr("x2", 0).attr("y1", 1).attr("y2", 0)
        .selectAll("stop").data(PCStops).join("stop").attr("offset", (d, i) => i / 5).attr("stop-color", (d) => d)


        redrawMap(0,0)
        redrawMap(0,1)
        d3.select("#selectQuarter_Abs").on("change", function (d) {
            redrawMap(this.value, 0)
        })
        d3.select("#selectQuarter_PC").on("change", function (d) {
            redrawMap(this.value, 1)
        })
        playButton[0].onclick = () => slider(0)
        playButton[1].onclick = () => slider(1)
    })