// The line plot
var margin = {top: 50, right: 20, bottom: 50, left: 50},
    width = 500 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

var line = d3.line()
    .x(function (d) {
        return x(d[0]);
    })
    .y(function (d) {
        return y(d[1]);
    });


var svg1 = d3.select("#graphs").append("svg")
    .attr("id", "svg1")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

var hands8 = [];

// Get the data
d3.text("hands.csv", function(error, text) {
    if (error) {
        console.log("error");
    } else {
        hands8 = d3.csvParseRows(text, function(d) {
            var hand = [];
            for (var i = 0; i < 56; i++) {
                var x = +d[i];
                var y = +d[i+56];
                hand.push([x,y]);
            }
             return hand;
        });
    }


    var mean_hand = [];
    for (var i=0;i<56;i++) {
        var sumX = 0;
        var sumY = 0;
        for (var j=0;j<40;j++) {
            //point = hands8[i][j];
            sumX += hands8[j][i][0];
            sumY += hands8[j][i][1];
        }
        mean_hand.push([sumX/40, sumY/40]);
    }
    console.log(mean_hand);

    console.log(hands8);

    x.domain([0, 1.2]);
    y.domain([0, 1.2]);

    svg1.selectAll(".dot")
        .data(mean_hand)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 3.5)
        .attr("cx", function(d) { return x(d[0]); })
        .attr("cy", function(d) { return y(d[1]); });

    svg1.append("path")
        .attr("class", "line2")
        .attr("d", line(mean_hand));

    svg1.append("path")
        .attr("class", "line")
        .attr("d", line(mean_hand))
        .on("mouseover", function() {
            d3.select(this)
                .style("fill", "crimson");
        })
        .on("mouseout", function() {
        d3.select(this)
            .style("fill", "black");
    });

    // Add the X Axis
    svg1.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // text label for the x axis
    svg1.append("text")
        .attr("transform",
            "translate(" + (width/2) + " ," +
            (height + 45) + ")")
        .style("text-anchor", "middle")
        .style("font-size", "24px")
        .text("X value");

    // Add the Y Axis
    svg1.append("g")
        .call(d3.axisLeft(y));

    // text label for the y axis
    svg1.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", - 5 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "24px")
        .text("Y value");

    var legend = svg1.append("g")
        .attr("class", "legend1")
        .attr("font-family", "sans-serif")
        .attr("font-size", 20)
        .attr("text-anchor", "end")
        .selectAll("g")
        .data([1])
        .enter().append("g")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("class", "legend1rect")
        .attr("x", width - 120)
        .attr("width", 110)
        .attr("height", 30)
        .attr("fill", "lightgray");

    legend.append("text")
        .attr("class", "legendhand")
        .attr("x", width - 45)
        .attr("y", 15)
        .attr("dy", "0.32em")
        .text("Hand #");

    legend.append("text")
        .attr("class", "l1text")
        .attr("x", width - 20)
        .attr("y", 15)
        .attr("dy", "0.32em")
        .text("0");

});

var div2 = d3.select("#graphs").append("div")
    .attr("class", "legend1div");

var div = d3.select("#graphs").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var margin2 = {top: 50, right: 20, bottom: 50, left: 50},
    width2 = 800 - margin2.left - margin2.right,
    height2 = 500 - margin2.top - margin2.bottom;


var svg2 = d3.select("#graphs").append("svg")
    .attr("id", "svg2")
    .attr("width", 700 + margin2.left + margin2.right)
    .attr("height", height2 + margin2.top + margin2.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin2.left + "," + margin2.top + ")");

var hands_pca = [];
var currentPCx = 0;
var currentPCy = 1;

// Get the data
d3.text("hands_pca.csv", function(error, text) {
    if (error) {
        console.log("error");
    } else {
            hands_pca = d3.csvParseRows(text, function(d) {
            var hand = [];
            for (var i = 0; i < 112; i++) {
                hand.push(+d[i]);
            }
            return hand;
        });
    }



    var first_two_pc = getPCs(0,1);
    


    /*
    for (var i=0; i<40; i++) {
        var first = hands_pca[i][0];
        var second = hands_pca[i][1];
        first_two_pc.push([first, second]);
    }
    */

    console.log(first_two_pc);
    console.log(first_two_pc[0]);
    console.log(first_two_pc);
    console.log(hands_pca);
    console.log(hands_pca[1]);

    // Scale the range of the data
    x.domain([-0.65, 0.65]);
    //y.domain(d3.extent(hands_pca, function(d) { return d[1]; }));
    y.domain([-0.65, 0.65]);

    //x.domain([-0.5, 0.5]);
    //y.domain([-0.5, 0.5]);


    svg2.selectAll(".dot")
        .data(first_two_pc)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("stroke", "lightblue")
        .attr("stroke-width", 2)
        .attr("fill", "none")
        .attr("r", 8)
        .attr("cx", function(d) { return x(d[0]); })
        .attr("cy", function(d) { return y(d[1]); })
        .on("mouseover", updatePlot1)
        .on("mouseout", updatePlot2);

    // Add the X Axis
    svg2.append("g")
        .attr("transform", "translate(0," + height2 + ")")
        .call(d3.axisBottom(x));

    // text label for the x axis
    svg2.append("text")
        .attr("transform",
            "translate(" + (450/2) + " ," +
            (height2 + 45) + ")")
        .style("text-anchor", "middle")
        .style("font-size", "24px")
        .attr("id", "xLabel")
        .text("Principal Component 1");

    // Add the Y Axis
    svg2.append("g")
        .call(d3.axisLeft(y));

    // text label for the y axis
    svg2.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", - 8 - margin2.left)
        .attr("x",0 - (height2 / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "24px")
        .attr("id", "yLabel")
        .text("Principal Component 2");

});

// Create Event Handlers for mouse
function updatePlot1(d, i) {  // Add interactivity

    x.domain([0, 1.2]);
    y.domain([0, 1.2]);
    // Use D3 to select element, change color and size
    d3.select(this)
        .attr("fill", "crimson")
        .call(function(d) {

            div.transition()
                .duration(200)
                .style("opacity", 1.0);
            div.html("Hand #" + i)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        });
    d3.selectAll(".line")
        .style("fill", "crimson");
    d3.selectAll(".legend1")
        .transition()
        .duration(200)
        .style("fill", "crimson");
    d3.selectAll(".l1text")
        .text(i);
    update(i);

}


function updatePlot2(d, i) {  // Add interactivity
    x.domain([0, 1.2]);
    y.domain([0, 1.2]);
    // Use D3 to select element, change color and size
    d3.select(this)
        .attr("stroke", "lightblue")
        .attr("stroke-width", 2)
        .attr("fill", "none")
        .call(function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });
    d3.selectAll(".line")
        .transition();
    d3.selectAll(".legend1")
        .transition()
        .duration(200)
        .style("opacity", .9)
        .style("fill", "black");



}



function update(i) {

    d3.select("#graphs")
        .selectAll('.line')
        .transition()
        .attr("d", line(hands8[i]));

}


/* Slider for X-axis*/
var slider = d3.sliderHorizontal()
               .min(1)
               .max(40)
               .step(1)
               .width(500)
               .on('onchange', val => {
                    /* update plot */
                    updateScatterX(val);
               })

var g = d3.select("div#slider2").append("svg")
          .attr("width", 600)
          .attr("height", 70)
          .append("g")
          .attr("transform", "translate(75,30)");

g.call(slider);


slider.axis = function(_) {
    if (!arguments.length) return axis;
    axis = 1;
    return slider;
}
/*Slider for Y-axis */
var sliderY = d3.sliderHorizontal()
               .min(1)
               .max(40)
               .step(1)
               .width(500)
               .on('onchange', val => {
                    /* update plot */
                    updateScatterY(val);
               })

var gY = d3.select("div#slider2Y").append("svg")
          .attr("width", 600)
          .attr("height", 70)
          .append("g")
          .attr("transform", "translate(75,30)");

gY.call(sliderY);




function updateScatterX(val) {
    var newPCs = getPCs(val-1, currentPCy);
    currentPCx = val-1;
    // Scale the range of the data
    x.domain([-0.65, 0.65]);
    //y.domain(d3.extent(hands_pca, function(d) { return d[1]; }));
    y.domain([-0.65, 0.65]);

    svg2.selectAll("circle")
      .data(newPCs)
      .transition()
      .duration(1000)
      .attr("cx", function(d) { return x(d[0]); } )
      .attr("cy", function(d) { return y(d[1]); } )
      .attr("r", 8)
      .attr("stroke", "lightblue")
      .attr("stroke-width", 2)
      .attr("fill", "none")

    d3.select("#xLabel").text("Principal Component " + val);
}


function updateScatterY(val) {
    var newPCs = getPCs(currentPCx, val-1);
    currentPCy = val-1;
    // Scale the range of the data
    x.domain([-0.65, 0.65]);
    //y.domain(d3.extent(hands_pca, function(d) { return d[1]; }));
    y.domain([-0.65, 0.65]);

    svg2.selectAll("circle")
      .data(newPCs)
      .transition()
      .duration(1000)
      .attr("cx", function(d) { return x(d[0]); } )
      .attr("cy", function(d) { return y(d[1]); } )
      .attr("r", 8)
      .attr("stroke", "lightblue")
      .attr("stroke-width", 2)
      .attr("fill", "none")

    d3.select("#yLabel").text("Principal Component " + val);
}



function getPCs(pc1,pc2) {

    res = [];
    for (var i=0; i<40; i++) {
        var first = hands_pca[i][pc1];
        var second = hands_pca[i][pc2];
        res.push([first, second]);
    }
    return res;
}