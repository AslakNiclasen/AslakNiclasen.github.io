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
}