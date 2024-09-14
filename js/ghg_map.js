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

const quarters = Array("2010-Q1" ,"2010-Q2" ,"2010-Q3" ,"2010-Q4" ,"2011-Q1" ,"2011-Q2" ,"2011-Q3" ,"2011-Q4" ,"2012-Q1" ,"2012-Q2" ,"2012-Q3" ,"2012-Q4" ,"2013-Q1" ,"2013-Q2" ,"2013-Q3" ,"2013-Q4" ,"2014-Q1" ,"2014-Q2" ,"2014-Q3" ,"2014-Q4" ,"2015-Q1" ,"2015-Q2" ,"2015-Q3" ,"2015-Q4" ,"2016-Q1" ,"2016-Q2" ,"2016-Q3" ,"2016-Q4" ,"2017-Q1" ,"2017-Q2" ,"2017-Q3" ,"2017-Q4" ,"2018-Q1" ,"2018-Q2" ,"2018-Q3" ,"2018-Q4" ,"2019-Q1" ,"2019-Q2" ,"2019-Q3" ,"2019-Q4" ,"2020-Q1" ,"2020-Q2" ,"2020-Q3" ,"2020-Q4" ,"2021-Q1" ,"2021-Q2" ,"2021-Q3" ,"2021-Q4" ,"2022-Q1" ,"2022-Q2" ,"2022-Q3" ,"2022-Q4" ,"2023-Q1" ,"2023-Q2" ,"2023-Q3" ,"2023-Q4" ,"2024-Q1" )

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
        
        nameArr.forEach( (el,i) => {
            svg_map.select("."+el)
            .attr("fill", colorScalePC(tonnesPC.get("2010-Q1")[i]))
        });
        svg_map.selectAll(".ND").attr("fill", "#737373")
    })