const id_stacked_percentage = "#stackedPercentage"

const margin_stacked = { top: 0, right: 0, bottom: 50, left: 50 },
    width_stacked = 1024 - margin_stacked.left - margin_stacked.right,
    height_stacked = 768 - margin_stacked.top - margin_stacked.bottom;


svg_stacked = d3.select(id_stacked_percentage)
    .append("svg")
    .attr("width", width_stacked + margin_stacked.left + margin_stacked.right)
    .attr("height", height_stacked + margin_stacked.top + margin_stacked.bottom)
    .attr("viewBox", '0 0 ' + (width_stacked + margin_stacked.left + margin_stacked.right) +
        ' ' + (height_stacked + margin_stacked.top + margin_stacked.bottom))
    .append("g")

y = d3.scaleLinear().domain([1, 0]).range([0, height_stacked])

const tooltip_Stacked = d3.select(id_stacked_percentage).append("div")
    .attr("class", "tooltip")
    .style("font-size", "14px")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("opacity", 0);


var pippo
d3.csv("data/percentageTHS.csv").then(function (data) {
    pippo = data
    x = d3.scaleBand().domain(d3.range(2008, 2022)).range([0, width_stacked]).padding(1)
    byGeo = groupBy(data, 'geo')
    coso = d3.stack().keys(data.columns.slice(2))(byGeo.IS)

    area = d3.area()
        .x(function (d, i) { return x(+d.data.year); })
        .y0(function (d) { return y(d[0]); })
        .y1(function (d) { return y(d[1]); })

    stackedG = svg_stacked.append("g")

    stackedG.selectAll("path").data(coso).join("path").attr("d", area).style("fill", d => palette.get(d.key)).attr("class", d => d.key)
        .on('mouseover', function (e, d) {
            stackedG.selectAll("path")
            .style("fill-opacity", "0.5").transition("selected")
            .duration(300)
            
            cat = d.key
            stackedG.selectAll("."+cat).style("stroke", "#000")
            .style("stroke-width", "2px").style("fill-opacity","1.0")
            .transition("selected").duration(300);

            tooltip_Stacked.transition("appear-box").duration(300)
            .style("opacity", "0.9")

            tooltip_Stacked.html("<span class='tooltiptext'>" + "<b> Category: " + cat +
                "</b></span>")
            .style("left", (e.pageX) + "px")
            .style("top", (e.pageY - 28) + "px");
        }).on("mouseout", function (e, d){
            stackedG.selectAll("path").style("stroke", "trasparent")
            .style("stroke-width", "0px").style("fill-opacity", "1")
            .transition("selected").duration(300)
        })
        
    svg_stacked.selectAll("g").on('mouseleave', function (e, d) {
        tooltip_Stacked.transition("disappear-box").duration(300).style("opacity", "0.0")
    })


    svg_stacked.append("g")
        .attr("transform", `translate(0, ${height_stacked})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .data(x.domain())
        .style("text-anchor", "center")
        .style("font-family", "Fira Sans, sans-serif")
        .style("font-size", "12px")

    svg_stacked.append("g").attr("transform", 'translate(50, 0)')
        .call(d3.axisLeft(y).tickValues([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]).tickFormat(d => d * 100 + '%'))

    for (const nation of nameMap.keys()) {
        d3.select("#stackedNation").append("option").html(nation).attr("value", nation)
    };

})


