const id_map = "#ghg_map"


const margin_map = {top: 50, right: 50, bottom: 60, left: 110},
    width_map = 1024 - margin_map.left - margin_map.right,
    height_map = 768 - margin_map.top - margin_map.bottom;

const scaleFactor_map = 0.8

var projection = d3.geoMercator()


const svg_map = d3.select(id_map)
    .append("svg")
    //.attr("width", width_map + margin_map.left + margin_map.right)
    //.attr("height", height_map + margin_map.top + margin_map.bottom)
    .attr("viewBox", '0 0 ' + (width_map + margin_map.left + margin_map.right) +
        ' ' + (height_map + margin_map.top + margin_map.bottom))
    .append("g")
    .attr("transform", `translate(${(1-scaleFactor_map)*width_map/2 + margin_map.left},
                                  ${(1-scaleFactor_map)*height_map/2 + margin_map.top})`);

Promise.all([
    d3.json("../data/europe_.geojson"),
    d3.tsv("../data/ghg_euro.tsv").then(function (data){
        console.log(data)
    })]
    ).then( function (loadData){
        let topo = loadData[0]
        projection.fitSize([scaleFactor_map*width_map, 
                            scaleFactor_map*height_map], topo);

        svg_map.append("g")
        .selectAll("path")
        .data(topo.features)
        .join("path")
            .attr("d", d3.geoPath().projection(projection))
            // .attr("fill", (d) => colorScale_map(data.get(d.properties.nome)))
            .style("fill-opacity", "0.9")
            // .attr("class", (d) => `circo${d.properties.numero_cir}`)
            .style("stroke", "white")
            .style("stroke-width", "1px");
    })