// Set up on-load initialization
d3.select(window).on('load', init);

// Initialiation function. Called after body has loaded
function init() {

    var svg = d3.select('svg');
    var margin = {top: 100, right: 100, bottom: 100, left: 100};
    var width = +svg.node().getBoundingClientRect().width - margin.left - margin.right;
    var height = +svg.node().getBoundingClientRect().height - margin.top - margin.bottom;

    var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
        y = d3.scaleLinear().rangeRound([height, 0]);

    var g = svg.append("g")
     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // load data and start making chart
    d3.csv("cphWeatherData.csv", function(data) {
   
      // a label for each bar when hovering
      var label = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("z-index", "10");
          
      var test = d3.min(data,(function(d){ return d.APR}));
      console.log(test);
      // retrieve min and max temperature values into two arrays
      var minValues = [
        d3.min(data,(function(d){ return parseFloat(d.JAN)})),
        d3.min(data,(function(d){ return parseFloat(d.FEB)})),
        d3.min(data,(function(d){ return parseFloat(d.MAR)})),
        d3.min(data,(function(d){ return parseFloat(d.APR)})),
        d3.min(data,(function(d){ return parseFloat(d.MAY)})),
        d3.min(data,(function(d){ return parseFloat(d.JUN)})),
        d3.min(data,(function(d){ return parseFloat(d.JUL)})),
        d3.min(data,(function(d){ return parseFloat(d.SEP)})),
        d3.min(data,(function(d){ return parseFloat(d.OCT)})),
        d3.min(data,(function(d){ return parseFloat(d.NOV)})),
        d3.min(data,(function(d){ return parseFloat(d.DEC)}))];

      console.log(minValues);

      var maxValues = [
        d3.max(data,(function(d1){ return parseFloat(d1.JAN)})),
        d3.max(data,(function(d1){ return parseFloat(d1.FEB)})),
        d3.max(data,(function(d1){ return parseFloat(d1.MAR)})),
        d3.max(data,(function(d1){ return parseFloat(d1.APR)})),
        d3.max(data,(function(d1){ return parseFloat(d1.MAY)})),
        d3.max(data,(function(d1){ return parseFloat(d1.JUN)})),
        d3.max(data,(function(d1){ return parseFloat(d1.JUL)})),
        d3.max(data,(function(d1){ return parseFloat(d1.SEP)})),
        d3.max(data,(function(d1){ return parseFloat(d1.OCT)})),
        d3.max(data,(function(d1){ return parseFloat(d1.NOV)})),
        d3.max(data,(function(d1){ return parseFloat(d1.DEC)}))];
        
      console.log(maxValues);
        // array for absolute temperature values
        var diffValues = [];

        // labels refered to x axis
        var months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','SEP','OCT','NOV','DEC'];

        // calculate absolute temperatures in each month
        for(var i = 0; i < maxValues.length; i++) {
            console.log(minValues[i] - maxValues[i]);
            diffValues[i] = Math.abs(minValues[i] - maxValues[i]);
        }

        // combined array for the absolute temperatures and months
        var result = [];
        // combined min and max temperatures for label
        var minmax = [];
        for(var i = 0; i < diffValues.length; i++) {
          result[i] = [months[i], diffValues[i]];
          minmax[i] = [minValues[i], maxValues[i], diffValues[i]];
        }

        console.log(diffValues);
        console.log(minmax);

        // the months
        x.domain(result.map(function(d) { return d[0]; }));
        
        // absolute values between 0 and 8
        y.domain([0, 15]);

      // create x axis
      g.append("g")
          .attr("class", "axisX")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));

      // create y axis
      g.append("g")
          .attr("class", "axisY")
          .call(d3.axisLeft(y));

      // draw svg bars based on 'result' array
      g.selectAll(".bar")
          .data(result)
          .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d[0]); })
          .attr("y", function(d) { return y(d[1]); })
          .attr("width", x.bandwidth())
          .attr("height", function(d) { return height - y(d[1]); })
          // add small label in form of a tip when hovering each bar
          // 'hack?' changes the data inbetween.
          .data(minmax)
          .on("mouseover", function(d){   
            label.style("opacity", 1); 
            label.html("Min temperature: " + d[0] + "<br>" + "Max temperature: " + d[1]);
            // change the location of the box depending on the mouse position.
            label.style("visibility", "visible")
               .style("left", (d3.event.pageX - 80) + "px")
               .style("top", (d3.event.pageY - 80) + "px"); })

          .on("mouseout", function() { label.style("visibility", "hidden");});
          

      // y label
      svg.append("text")
          .attr("class","textY")
          .attr("transform", "rotate(-90)")
          .attr("y", 50)
          .attr("x", 0 - height/1.2)
          .style("text-anchor", "middle")
          .text("Absolute temperatures differences");

      // x label
      svg.append("text")
          .attr("class","textX")
          .attr("transform",
          "translate(" + (width / 1.75) + " ," + 
                           (height + margin.top + 60) + ")")
          .style("text-anchor", "middle")
          .text("Month");

      // title of graph
      svg.append("text")
         .attr("class","title")
         .attr("x", (width / 2) + 140)
         .attr("y", margin.top / 2)
         .attr("text-anchor", "middle")
         .text("Temperature fluctuations on a monthly basis")
    });
    
        // LINE PART STARTS HERE
    var margin2 = {top: 50, right: 20, bottom: 100, left: 50},
        width2 = 900 - margin2.left - margin2.right,
        height2 = 500 - margin2.top - margin2.bottom;

    var x2 = d3.scaleTime().range([0, width2]);
    var y2 = d3.scaleLinear().range([height2, 0]);

    var winter_temps = d3.line()
        .x(function(d) { return x2(d.YEAR); })
        .y(function(d) { return y2(d.DJF); });

    var spring_temps = d3.line()
        .x(function(d) { return x2(d.YEAR); })
        .y(function(d) { return y2(d.MAM); });

    var summer_temps = d3.line()
        .x(function(d) { return x2(d.YEAR); })
        .y(function(d) { return y2(d.JJA); });

    var fall_temps = d3.line()
        .x(function(d) { return x2(d.YEAR); })
        .y(function(d) { return y2(d.SON); });

    // gridlines in x axis function
    function make_x_gridlines() {
        return d3.axisBottom(x2)
            .ticks(12)
    }

    // gridlines in y axis function
    function make_y_gridlines() {
        return d3.axisLeft(y2)
            .ticks(6)
    }

    var line2 = d3.line()
        .x(function (d) { return x2(d.x); })
        .y(function (d) { return y2(d.y); });

    var svg2 = d3.select("body").append("svg")
        .attr("width", width2 + margin2.left + margin2.right)
        .attr("height", height2 + margin2.top + margin2.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin2.left + "," + margin2.top + ")");

    // Get the data
    d3.csv("cphWeatherData2.csv", function(error, data) {
        if (error) throw error;

        var winter_avg = d3.mean(data, function(d) {return d.DJF;});
        var spring_avg = d3.mean(data, function(d) {return d.MAM;});
        var summer_avg = d3.mean(data, function(d) {return (d.JJA < 40) ? d.JJA :17;});
        var fall_avg = d3.mean(data, function(d) {return (d.SON < 40) ? d.SON :9;});

        var winter_avg_line = [
            { "x": 1880,   "y": winter_avg},
            { "x": 2017,  "y": winter_avg}
        ];
        var spring_avg_line = [
            { "x": 1880,   "y": spring_avg},
            { "x": 2017,  "y": spring_avg}
        ];
        var summer_avg_line = [
            { "x": 1880,   "y": summer_avg},
            { "x": 2017,  "y": summer_avg}
        ];
        var fall_avg_line = [
            { "x": 1880,   "y": fall_avg},
            { "x": 2017,  "y": fall_avg}
        ];

        // format the data
        data.forEach(function(d) {
            d.YEAR = +d.YEAR;
            d.DJF = +d.DJF;
            d.MAM = +d.MAM;
            d.JJA = (d.JJA < 40) ? +d.JJA :17;
            d.SON = (d.SON < 40) ? d.SON :9;
            d.metANN = +d.metANN;
        });

        // Scale the range of the data
        x2.domain(d3.extent(data, function(d) { return d.YEAR; }));
        y2.domain([-5, 25]);

        // Add the valueline path. winter 1
        svg2.append("path")
            .data([data])
            .attr("class", "line2")
            .attr("d", winter_temps)
            .style("stroke", "steelblue");

        // Add the valueline path .  spring 2
        svg2.append("path")
            .data([data])
            .attr("class", "line2")
            .attr("d", spring_temps)
            .style("stroke", "green");

        // Add the valueline path .  summer 3
        svg2.append("path")
            .data([data])
            .attr("class", "line2")
            .attr("d", summer_temps)
            .style("stroke", "tomato");

        // Add the valueline path . fall  4
        svg2.append("path")
            .data([data])
            .attr("class", "line2")
            .attr("d", fall_temps)
            .style("stroke", "orange");

        // Add the path . winter average line
        svg2.append("path")
            .data([winter_avg_line])
            .attr("class", "line2")
            .attr("d", line2)
            .style("stroke", "blue");

        // Add the path . spring average line
        svg2.append("path")
            .data([spring_avg_line])
            .attr("class", "line2")
            .attr("d", line2)
            .style("stroke", "olive");

        // Add the path . summer average line
        svg2.append("path")
            .data([summer_avg_line])
            .attr("data-legend", "hejsa")
            .attr("class", "line2")
            .attr("d", line2)
            .style("stroke", "crimson");

        // Add the path . fall average line
        svg2.append("path")
            .data([fall_avg_line])
            .attr("class", "line2")
            .attr("d", line2)
            .style("stroke", "orangered")
            .attr("data-legend",function(d) {return d.x});

        // add the X gridlines
        svg2.append("g")
            .attr("class", "grid")
            .style("stroke-width", "0.2")
            .attr("transform", "translate(0," + height2 + ")")
            .call(make_x_gridlines()
                .tickSize(-height2)
                .tickFormat("")
            );

        // add the Y gridlines
        svg2.append("g")
            .attr("class", "grid")
            .style("stroke-width", "0.2")
            .call(make_y_gridlines()
                .tickSize(-width2)
                .tickFormat("")
            );

        // Add the X Axis
        svg2.append("g")
            .attr("transform", "translate(0," + height2 + ")")
            .call(d3.axisBottom(x2).tickFormat(d3.format("d")));

        // text label for the x axis
        svg2.append("text")
            .attr("transform",
                "translate(" + (width2/2) + " ," +
                (height2 + 35) + ")")
            .style("text-anchor", "middle")
            .text("Year");

        // Add the Y Axis
        svg2.append("g")
            .call(d3.axisLeft(y2));

        // text label for the y axis
        svg2.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin2.left)
            .attr("x",0 - (height2 / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Degrees Celsius");


        svg2.append("text")
            .attr("x", 150)  // space legend
            .attr("y", 400)
            .attr("class", "legend2")    // style the legend
            .style("fill", "tomato")
            .text("Summer");

        svg2.append("text")
            .attr("x", 150)  // space legend
            .attr("y", 430)
            .attr("class", "legend2")    // style the legend
            .style("fill", "orange")
            .text("Fall");

        svg2.append("text")
            .attr("x", 250)  // space legend
            .attr("y", 400)
            .attr("class", "legend2")    // style the legend
            .style("fill", "green")
            .text("Spring");

        svg2.append("text")
            .attr("x", 250)  // space legend
            .attr("y", 430)
            .attr("class", "legend2")    // style the legend
            .style("fill", "steelblue")
            .text("Winter");

        svg2.append("text")
            .attr("x", 550)  // space legend
            .attr("y", 400)
            .attr("class", "legend2")    // style the legend
            .style("fill", "crimson")
            .text("Summer Avg");

        svg2.append("text")
            .attr("x", 550)  // space legend
            .attr("y", 430)
            .attr("class", "legend2")    // style the legend
            .style("fill", "orangered")
            .text("Fall Avg");

        svg2.append("text")
            .attr("x", 680)  // space legend
            .attr("y", 400)
            .attr("class", "legend2")    // style the legend
            .style("fill", "olive")
            .text("Spring Avg");

        svg2.append("text")
            .attr("x", 680)  // space legend
            .attr("y", 430)
            .attr("class", "legend2")    // style the legend
            .style("fill", "blue")
            .text("Winter Avg");

    });
}
