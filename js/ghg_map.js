const id_map = "#ghg_map"


const margin_map = {top: 0, right: 0, bottom: 0, left: 0},
    width_map = 1024 - margin_map.left - margin_map.right,
    height_map = 768 - margin_map.top - margin_map.bottom;

const scaleFactor_map = 1

var projection = d3.geoMercator()

const tonnesAbs = new Map()
var maxAbs = 0
var minAbs = 1e6

const tonnesPC = new Map()
var maxPC = 0
var minPC = 1e6


var colorScaleAbs
var colorScalePC 

const svg_map = d3.select(id_map)
    .append("svg")
    .attr("width", width_map + margin_map.left + margin_map.right)
    .attr("height", height_map + margin_map.top + margin_map.bottom)
    .attr("viewBox", '0 0 ' + (width_map + margin_map.left + margin_map.right) +
        ' ' + (height_map + margin_map.top + margin_map.bottom))
    .append("g")
var pippo

function redrawMap(idx)
{
    console.log(+idx)
    nameArr.forEach( (el,i) => {
        svg_map.select("."+el)
        .attr("fill", colorScalePC(tonnesPC.get(quarters[+idx])[i]))
    });
    svg_map.selectAll(".ND").attr("fill", "#737373")
}
var isPlaying = false
var intervalID
var playButton = document.getElementById("playButton")
var select = document.getElementById("selectQuarter")

function tick()
{
    var value = +select.value +1
    if (value == quarters.length -1)
    {
        isPlaying = !isPlaying
        clearInterval(intervalID)
        playButton.innerHTML = "<i class='fa fa-play'></i>"
    }
    select.value = +value
    select.dispatchEvent(new Event("change"))
}

function slider()
{
    if(isPlaying)
    {
        clearInterval(intervalID)
        playButton.innerHTML = "<i class='fa fa-play'></i>"
    }
    else
    {
        var idx = +select.value +1
        if(idx == quarters.length)
            select.value = 0
        intervalID = setInterval(tick, 300)
        select.value = String(idx)
    }
    isPlaying = !isPlaying
}

Promise.all([
    d3.json("../data/europe_.geojson"),
    d3.csv("../data/perCapita.csv").then( function (d) {
        d.forEach(el => {
            tmp = Object.values(el).slice(1)
            m = Math.min(...tmp)
            M = Math.max(...tmp)
            if(m < minPC)
                minPC = m
            if(M > maxPC)
                maxPC = M
            tonnesPC.set(el.quarter, tmp)
        });
    }),
    d3.csv("../data/absolute.csv").then( function (d) {
        d.forEach(el => {
            tmp = Object.values(el).slice(1)
            m = Math.min(...tmp)
            M = Math.max(...tmp)
            if(m < minAbs)
                minAbs = m
            if(M > maxAbs)
                maxAbs = M
            tonnesAbs.set(el.quarter, tmp)
        });
    })
]
    ).then( function (loadData){
        let topo = loadData[0]
                
        projection.scale(650)
        projection.clipExtent([[0, 0], [width_map / 4 *3 , height_map]])
        projection.center([16.39333,63])
        // projection.translate(0, 0)
        pippo = loadData
        colorScalePC = d3.scaleSequential([0, maxPC], d3.interpolateReds)
        svg_map.append("g")
        .selectAll("path")
        .data(topo.features)
        .join("path")
            .attr("d", d3.geoPath().projection(projection))
            // .attr("fill", function (d) { if (nameArr.includes(d.properties.name)) return "red"; else return "blue"})
            .attr("class", (d) => nameMap.get(d.properties.name) || "ND")
            .style("fill-opacity", "0.9")
            .style("stroke", "white")
            .style("stroke-width", "1px");
        redrawMap(0)
        d3.select("#selectQuarter").on("change", function (d) {
            console.log(this)
            redrawMap(this.value)
        })
        playButton.onclick = slider
    })