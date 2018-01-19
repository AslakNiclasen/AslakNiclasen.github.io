d3.select(window).on('load', init);

var copyOfData = null;
var copyOfRaceState = null;
var copyOfSexAge = null;
var copyOfVictimsAge = null;

// Initialiation function. Called after body has loaded
function init() {

  // bar chart starting variables start here
  var margin = {top: 20, right: 30, bottom: 100, left: 100},
    width = 1160 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

  var xHist = d3.scaleBand().rangeRound([0, width]).padding(0.5);
  var yHist = d3.scaleLinear().rangeRound([height, 0]);

  var xAxisHist = d3.axisBottom()
    .scale(xHist);

  var yAxisHist = d3.axisLeft()
    .scale(yHist);

  var svgHistogram = d3.select("#svgHistogram")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // tooltips for bar chart
  var label = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("z-index", "10");

  var clickHistogram = 0;
// bar chart starting variables end here


// Timeline starting variables starts here
  var labelTimeline = d3.select("body").append("div")
      .attr("class", "tooltipTimeline")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("z-index", "10");


  var margin = {top: 20, right: 30, bottom: 100, left: 100},
      widthTimeline = 1200 - margin.left - margin.right,
      heightTimeline = 820 - margin.top - margin.bottom;

  var xTimeline = d3.scaleTime().range([0, widthTimeline]);

  var yTimeline = d3.scaleLinear().rangeRound([heightTimeline, 0]);

  var xAxisTimeline = d3.axisBottom()
    .scale(xTimeline);

  var yAxisTimeline = d3.axisLeft()
    .scale(yTimeline);

  var parseTime = d3.timeParse("%m/%d/%Y");
  var formatTime = d3.timeFormat("%m/%d/%Y");

  var svgTimeline = d3.select("#svgTimeline")
      .attr("width", widthTimeline + margin.left + margin.right)
      .attr("height", heightTimeline + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .attr("padding", 10);
  
  var click = 0;
  // Timeline starting variables ends here

  // Scatterplot starting variables starts here
  
  var margin = {top: 20, right: 30, bottom: 100, left: 100},
      widthScatter = 1000 - margin.left - margin.right,
      heightScatter = 800 - margin.top - margin.bottom;  

  // based on the dropdown menu
  // here we set the initial scatterplot variables  
  var xStacked = d3.scaleTime().range([0, widthScatter]);
  var yStacked = d3.scaleLinear().rangeRound([heightScatter, 0]);

  var xAxisStacked = d3.axisBottom()
    .scale(xStacked);

  var yAxisStacked = d3.axisLeft()
    .scale(yStacked);  

  var svgStacked = d3.select("#svgStacked")
      .attr("width", widthScatter + margin.left + margin.right)
      .attr("height", heightScatter + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .attr("padding", 10);

  var labelScatter = d3.select("body").append("div")
      .attr("class", "tooltipScatter")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("z-index", "10");

  // Scatterplot ending varibles ends here

  // LOADING CSV FILE AND START PLOTTING ALL 'INITIAL PLOTS'
  d3.csv("execution_database.csv", function(data) {

      copyOfData = data;
      



      //BAR CHART PLOTTING START
      // map data into 5 bins according to execution method
      var histogramData = d3.nest()
        .key(function(d) { return d.Method; })
        .entries(data);

      var raceData1 = d3.nest()
        .key(function(d) { return d.Race; })
        .entries(data);

      var sexData = d3.nest()
        .key(function(d) { return d.Sex; })
        .entries(copyOfData);

      // bar heights for histogram
      var sumElectrocutions = histogramData[0].values.length;
      var sumLethalInjection = histogramData[1].values.length;
      var sumHanging = histogramData[2].values.length;
      var sumGasChamber = histogramData[3].values.length;
      var sumFiringSquad = histogramData[4].values.length;
      var histData =  [sumElectrocutions, sumLethalInjection, sumHanging, sumGasChamber, sumFiringSquad];
      
      // place data in a neat way when drawing the bar chart.
      var histPlot = [];
      for (i = 0; i < histData.length; i++) {
          histPlot[i] = [method[i], histData[i]];
      }

      xHist.domain(method);
      yHist.domain([0, 200]); 
      
      // x - axis
      svgHistogram.append("g")
        .attr("class", "xAxis")
        .attr("transform", "translate(0," + height + ")")
        .style("font-size", 16)
        .call(xAxisHist);

      // y - axis
      svgHistogram.append("g")
        .attr("class", "yAxis")
        .style("font-size", 16)
        .call(yAxisHist);

      // drawing the individual bars
      svgHistogram.selectAll(".bar")
        .data(histPlot)
        .enter()
        .append("rect")
        .on("mouseover", function(d) {   
            label.style("opacity", 1); 
            label.html("Number of " + d[0] + "s" + "<br>" + d[1]);
            label.style("visibility", "visible")
               .style("left", (d3.event.pageX - 80) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
        .on("mouseout", function() { label.style("visibility", "hidden");})
        .attr("class", "bar")
        .attr("x", function(d) { return xHist(d[0]); })
        .attr("y", function(d) { return yHist(d[1]); })
        .attr("height", function(d) { return height - yHist(d[1]); })
        .attr("width", xHist.bandwidth());

      // y label
      svgHistogram.append("text")
          .attr("class","textY")
          .attr("id", "histLabelY")
          .attr("transform", "rotate(-90)")
          .attr("y", -50)
          .attr("x", 150 - height/1.2)
          .style("text-anchor", "middle")
          .style("font-size", 24)
          .text("Number of executions");

      // x label
      svgHistogram.append("text")
          .attr("class","textX")
          .attr("id", "histLabelX")
          .style("text-anchor", "middle")
          .style("font-size", 24)
          .attr("y", height + 50)
          .attr("x", width / 2)
          .text("Type of Execution");

      //text element next to arrow
      svgHistogram.append("text")
          .attr("class","histx10")
          .attr("font-family", "calibri")
          .attr("font-size", "20px")
          .attr("fill", "gray")
          .attr("x", width / 2 - 80)
          .attr("y", 200)
          .text("x10");                 

      d3.select('#changeViewHistogram')
        .on("click", onClickHistogram);

      // BAR CHART PLOTTING END


      // TIMELINE START
      d3.select('#changeView')
        .on("click", onClick);

      // date manipulation into individual arrays for slider update
      
      for (i=0; i<42; i++) {
          allYears.push(new Array());
      }
      var index = 0;
      data.forEach(function(d) {
        index = index + 1;
        the_year = d.Date.substring(6,10);
        allYears[(the_year-1977)].push(d);

      }); 

      // Scale the range of the data
      // age domain y-axis - ages range from 22 - 77
      var minAge = d3.min(data, (function(d){ return d.Age}));
      var maxAge = d3.max(data, (function(d){ return d.Age}));

      yTimeline.domain([0, maxAge]);
      
      // date domain - initial year is 1977
      var mindate = new Date(1977,0,1);
      var maxdate = new Date(1977,11,31);
      xTimeline.domain([mindate, maxdate])
      
      // x Axis
      svgTimeline.append("g")
        .attr("class", "axis")
        .attr("id", "xaxis")
        .attr("transform", "translate(0," + heightTimeline + ")")
        .call(d3.axisBottom(xTimeline)
                .tickFormat(d3.timeFormat("%d-%b-%Y")))
        .selectAll("text")  
          .style("text-anchor", "center")
          .attr("font-size", 14)
          .attr("dx", "0em")
          .attr("dy", "2em");

      // y Axis
      svgTimeline.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(yTimeline))
        .selectAll("text")
          .attr("font-size", 14);

      // y label
      svgTimeline.append("text")
          .attr("class","textY")
          .attr("transform", "rotate(-90)")
          .attr("y", -60)
          .attr("x",100 - height)
          .attr("font-size", 24)
          .style("text-anchor", "middle")
          .text("Age of the convicted");

      // x label
      svgTimeline.append("text")
          .attr("class","textX")
          .style("text-anchor", "middle")
          .attr("y", height + 375)
          .attr("x", width / 1.6)
          .attr("font-size", 24)
          .text("Date of execution");

      // x Axis redrawn
      svgTimeline.append("g")
          .attr("class", "axis")
          .attr("id", "xaxis")
          .attr("transform", "translate(0," + heightTimeline + ")")
          .call(d3.axisBottom(xTimeline)
                  .tickFormat(d3.timeFormat("%d-%b-%Y")))
          .selectAll("text")  
            .style("text-anchor", "center")
            .attr("font-size", 14)
            .attr("dx", "0em")
            .attr("dy", "2em");
      
      svgTimeline.selectAll(".dot")
        .data(data) // initially set at 1977
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("stroke", function(d) { return pickCircleColor(d); })
        .attr("stroke-width", 2)
        .attr("fill", function(d) { return pickCircleColor(d); })
        .attr("opacity", 0.5)
        .attr("r", function(d) {
                                  if (calculateCircleRadius(d) + 1 > 100) {
                                      return 100;
                                 }
                                 else {
                                     return (calculateCircleRadius(d) + 1);
                                 }
                                })
        .attr("cx", function(d) {
                                  // fixing an additional parsing of dates
                                  // by formatting and reparsing
                                  
                                  d1 = d
                                  if (parseTime(d.Date) == null) {
                                    
                                    d.Date = formatTime(d1.Date);
                                    d.Date = parseTime(d.Date)
                                    return xTimeline(d.Date);
                                  }
                                  else {
                                    
                                    d.Date = parseTime(d.Date)
                                    
                                    return xTimeline(d.Date);
                                  }
                                  })
        .attr("cy", function(d) { return yTimeline(d.Age); })

        .on("mouseover", function(d) {   
            labelTimeline.style("opacity", 1); 
            labelTimeline.html("<br>Name: " + d.Name + "<br><br>" +
                       "Age: " + d.Age + "<br><br>" +
                       "Race: " + d.Race + "<br><br>" +
                       "Sex: " + d.Sex + "<br><br>" +
                       "Executed in: " + d.State + "<br><br>" +
                       "Type of Death: " + d.Method + "<br><br>" +
                       "victims: " + calculateVictims(d)
                       );
            labelTimeline.style("visibility", "visible")
               .style("left", (d3.event.pageX + 150) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
        .on("mouseout", function() { labelTimeline.style("visibility", "hidden");});

        var textInfo = svgTimeline.append("text")
            .attr("id","infoText")
            .attr("font-size", 60)
            .attr("fill", "steelblue")
            .attr("opacity", 0.8)
            .attr("x", "400")
            .attr("y", "75")
            .text("Year " + 1977);

        // slider being drawn here
        drawTimeSlider();

      // TIMELINE END

        // STACKED BARCHART DRAWED FIRST TIME
        xAgeRace();

      // mapping of each category for stacked barCHart
      /*
      d3.select('#xAge')
        .on("click", xAge);
      d3.select('#xRace')
        .on("click", xRace);
      d3.select('#xSex')
        .on("click", xSex);
      d3.select('#xVictim')
        .on("click", xVictim);
      d3.select('#xType')
        .on("click", xType);
      d3.select('#xState')
        .on("click", xState);
      */
      d3.select('#xAgeRace')
        .on("click", xAgeRace);
      d3.select('#xRaceState')
        .on("click", xRaceState);
      d3.select('#xSexAge')
        .on("click", xSexAge);
      d3.select('#xVictimsAge')
        .on("click", xVictimsAge);       
  // csv load function end
  });

  // HELPER FUNCTIONS for timeline and stacked histograms
  // Choosing the color of a circle based on the type of execution
  function pickCircleColor(data) {   
      if (data.Method == "Electrocution") {
        return "red";
      }
      else if (data.Method == "Hanging") {
        return "green";
      }
      else if (data.Method == "Lethal Injection") {
        return "steelblue";
      }
      else if (data.Method == "Gas Chamber") {
        return "gray";
      }
      else { // method was Firing squad
        return "black";
      }
  }

  // determining r of individual circles
  function calculateCircleRadius(data) {
    var aString = data["Number / Race / Sex of Victims"];
    var sumVictims = aString.match(/\d+/g).map(Number).reduce((a, b) => a + b, 0);
    return sumVictims * 2.5; // scaling by a factor of 2.5
  }


// Timeline function to show everything at once
  function updateFullView(allData) {
    
    // remove x axis and circles
    svgTimeline.selectAll("circle").remove()
    svgTimeline.selectAll("#xaxis").remove()
    svgTimeline.selectAll("text").remove()

    mindate = new Date(1977,0,1);
    maxdate = new Date(2017,11,31);
    xTimeline.domain([mindate, maxdate])

    // scale x-axis to full size and redraw all datapoints again
    // x Axis redrawn
    svgTimeline.append("g")
      .attr("class", "axis")
      .attr("id", "xaxis")
      .attr("transform", "translate(0," + heightTimeline + ")")
      .call(d3.axisBottom(xTimeline)
              .tickFormat(d3.timeFormat("%d-%b-%Y")))
      .selectAll("text")  
      .style("text-anchor", "center")
      .attr("font-size", 14)
      .attr("dx", "0em")
      .attr("dy", "2em");

    // x label
    svgTimeline.append("text")
      .attr("class","textX")
      .style("text-anchor", "middle")
      .attr("y", height + 375)
      .attr("x", width / 1.6)
      .attr("font-size", 24)
      .text("Date of execution");

    // y Axis redrawn
    svgTimeline.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(yTimeline))
      .selectAll("text")
        .attr("font-size", 14);

    // y label
    svgTimeline.append("text")
      .attr("class","textY")
      .attr("transform", "rotate(-90)")
      .attr("y", -60)
      .attr("x",100 - height)
      .attr("font-size", 24)
      .style("text-anchor", "middle")
      .text("Age of the convicted");

    svgTimeline.selectAll(".dot")
      .data(allData) // initially set at 1977
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("stroke", function(d) { return pickCircleColor(d); })
      .attr("stroke-width", 2)
      .attr("fill", function(d) { return pickCircleColor(d); })
      .attr("opacity", 0.5)
      .attr("r", function(d) {  if (calculateCircleRadius(d) + 1 > 100) {
                                  return 100;
                                }
                                else {
                                  return (calculateCircleRadius(d) + 1);
                                 }})
      .attr("cx", function(d) { d1 = d
                                if (parseTime(d.Date) == null) {
                                  d.Date = formatTime(d1.Date);
                                  d.Date = parseTime(d.Date)
                                  return xTimeline(d.Date);
                                }
                                else {
                                  d.Date = parseTime(d.Date)
                                  return xTimeline(d.Date);
                                }})
        .attr("cy", function(d) { return yTimeline(d.Age); });
  }

  // Updating timeline view based on slider position
  // Fetch new data view changing x axis domain and updating points based on data
  function updateTimeline(val, allData) {
      if (val == 1978 || val == 1980) {
        svgTimeline.selectAll("text").remove();
        // informative text
        var textInfo = svgTimeline.append("text")
            .attr("id","infoText")
            .attr("font-size", 60)
            .attr("fill", "gray")
            .attr("opacity", 0.8)
            .attr("x", "250")
            .attr("y", "350")
            .text("No executions for year " + val);
      }    
      else {
        svgTimeline.selectAll("text").remove();
        
        var textInfo = svgTimeline.append("text")
            .attr("id","infoText")
            .attr("font-size", 60)
            .attr("fill", "steelblue")
            .attr("opacity", 0.8)
            .attr("x", "400")
            .attr("y", "75")
            .text("Year " + val);
      }
      svgTimeline.selectAll("circle").remove()
      svgTimeline.selectAll("#xaxis").remove()

      startDate = new Date(val,0,1);
      endDate = new Date(val,11,31);
      xTimeline.domain([startDate, endDate]);
      
      

      // x Axis redrawn
      svgTimeline.append("g")
          .attr("class", "axis")
          .attr("id", "xaxis")
          .attr("transform", "translate(0," + heightTimeline + ")")
          .call(d3.axisBottom(xTimeline)
                  .tickFormat(d3.timeFormat("%d-%b-%Y")))
          .selectAll("text")  
            .style("text-anchor", "center")
            .attr("font-size", 14)
            .attr("dx", "0em")
            .attr("dy", "2em");

      // x label
      svgTimeline.append("text")
          .attr("class","textX")
          .style("text-anchor", "middle")
          .attr("y", height + 375)
          .attr("x", width / 1.6)
          .attr("font-size", 24)
          .text("Date of execution");
      
      // y Axis redrawn
      svgTimeline.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(yTimeline))
        .selectAll("text")
          .attr("font-size", 14);

      // y label
      svgTimeline.append("text")
          .attr("class","textY")
          .attr("transform", "rotate(-90)")
          .attr("y", -60)
          .attr("x",100 - height)
          .attr("font-size", 24)
          .style("text-anchor", "middle")
          .text("Age of the convicted");

      // redraw certain circles
      svgTimeline.selectAll(".dot")
        .data(getYear(val, allData)) // initially set at 1977
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("stroke", function(d) { return pickCircleColor(d); })
        .attr("stroke-width", 2)
        .attr("fill", function(d) { return pickCircleColor(d); })
        .attr("opacity", 0.5)
        .attr("r", function(d) { if (calculateCircleRadius(d) + 1 > 100) {
                                    return 100;
                                 }
                                 else {
                                    return (calculateCircleRadius(d) + 1);
                                 }})
        .attr("cx", function(d) {
                                  // fixing an additional parsing of dates
                                  // by formatting and reparsing
                                  d1 = d
                                  if (parseTime(d.Date) == null) {
                                    d.Date = formatTime(d1.Date);
                                    d.Date = parseTime(d.Date)
                                    return xTimeline(d.Date);
                                  }
                                  else {
                                    d.Date = parseTime(d.Date)
                                    return xTimeline(d.Date);
                                  }})
        .attr("cy", function(d) { return yTimeline(d.Age); })

        // tooltip providing information on the execution.
        .on("mouseover", function(d) {   
            labelTimeline.style("opacity", 1); 
            labelTimeline.html("<br>Name: " + d.Name + "<br><br>" +
                       "Age: " + d.Age + "<br><br>" +
                       "Race: " + d.Race + "<br><br>" +
                       "Sex: " + d.Sex + "<br><br>" +
                       "Executed in: " + d.State + "<br><br>" +
                       "Type of Death: " + d.Method + "<br><br>" +
                       "victims: " + calculateVictims(d)
                       );
            labelTimeline.style("visibility", "visible")
               .style("left", (d3.event.pageX + 150) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
        .on("mouseout", function() { labelTimeline.style("visibility", "hidden");});   
  }

  function updateFullViewHistogram(data) {
     svgHistogram.selectAll(".xAxis").remove();
     svgHistogram.selectAll(".yAxis").remove(); 
     d3.selectAll("#arrow").attr("opacity", 0);
     d3.selectAll("#myLine").attr("opacity", 0);
     svgHistogram.selectAll(".histx10").attr("opacity", 0);
      var xAxisHist = d3.axisBottom()
        .scale(xHist);

      var yAxisHist = d3.axisLeft()
        .scale(yHist);

      var histogramData = d3.nest()
          .key(function(d) { return d.Method; })
          .entries(data);

      // bar heights for histogram
      var sumElectrocutions = histogramData[0].values.length;
      var sumLethalInjection = histogramData[1].values.length;
      var sumHanging = histogramData[2].values.length;
      var sumGasChamber = histogramData[3].values.length;
      var sumFiringSquad = histogramData[4].values.length;
      var histData =  [sumElectrocutions, sumLethalInjection, sumHanging, sumGasChamber, sumFiringSquad];
      
      // place data in a neat way when drawing the bar chart.
      var histPlot = [];
      for (i = 0; i < histData.length; i++) {
          histPlot[i] = [method[i], histData[i]];
      }

      xHist.domain(method);
      yHist.domain([0, 1200]); 
      
      // x - axis
      svgHistogram.append("g")
        .attr("class", "xAxis")
        .attr("transform", "translate(0," + height + ")")
        .style("font-size", 16)
        .call(xAxisHist);

      // y - axis
      svgHistogram.append("g")
        .attr("class", "yAxis")
        .style("font-size", 16)
        .call(yAxisHist);

      // drawing the individual bars
      svgHistogram.selectAll("rect")
        .on("mouseover", function(d) {   
            label.style("opacity", 1); 
            label.html("Number of " + d[0] + "s" + "<br>" + d[1]);
            label.style("visibility", "visible")
               .style("left", (d3.event.pageX) + "px")
               .style("top", (d3.event.pageY) + "px"); })
        .on("mouseout", function() { label.style("visibility", "hidden");})
        .transition()
        .duration(2000)
        .attr("x", function(d) { return xHist(d[0]); })
        .attr("y", function(d) { return yHist(d[1]); })
        .attr("height", function(d) { return height - yHist(d[1]); })
        .attr("width", xHist.bandwidth());

      // y label
      svgHistogram.append("text")
          .attr("class","textY")
          .attr("id", "histLabelY")
          .attr("transform", "rotate(-90)")
          .attr("y", -50)
          .attr("x", 150 - height/1.2)
          .style("text-anchor", "middle")
          .style("font-size", 24)
          .text("Number of executions");

      // x label
      svgHistogram.append("text")
          .attr("class","textX")
          .attr("id", "histLabelX")
          .style("text-anchor", "middle")
          .style("font-size", 24)
          .attr("y", height + 50)
          .attr("x", width / 2)
          .text("Type of Execution");
  }

  function updateHistogram(data) {
    svgHistogram.selectAll(".xAxis").remove();
    svgHistogram.selectAll(".yAxis").remove();
    d3.selectAll("#arrow").attr("opacity", 1);
    d3.selectAll("#myLine").attr("opacity", 1);
    svgHistogram.selectAll(".histx10").attr("opacity", 1);

    var xAxisHist = d3.axisBottom()
      .scale(xHist);

    var yAxisHist = d3.axisLeft()
      .scale(yHist);

    var histogramData = d3.nest()
        .key(function(d) { return d.Method; })
        .entries(data);

      // bar heights for histogram
      var sumElectrocutions = histogramData[0].values.length;
      var sumLethalInjection = histogramData[1].values.length;
      var sumHanging = histogramData[2].values.length;
      var sumGasChamber = histogramData[3].values.length;
      var sumFiringSquad = histogramData[4].values.length;
      var histData =  [sumElectrocutions, sumLethalInjection, sumHanging, sumGasChamber, sumFiringSquad];
      
      // place data in a neat way when drawing the bar chart.
      var histPlot = [];
      for (i = 0; i < histData.length; i++) {
          histPlot[i] = [method[i], histData[i]];
      }

      xHist.domain(method);
      yHist.domain([0, 200]); 
      
      // x - axis
      svgHistogram.append("g")
        .attr("class", "xAxis")
        .attr("transform", "translate(0," + height + ")")
        .style("font-size", 16)
        .call(xAxisHist);

      // y - axis
      svgHistogram.append("g")
        .attr("class", "yAxis")
        .style("font-size", 16)
        .call(yAxisHist);

      // drawing the individual bars
      svgHistogram.selectAll("rect")
        .on("mouseover", function(d) {   
            label.style("opacity", 1); 
            label.html("Number of " + d[0] + "s" + "<br>" + d[1]);
            label.style("visibility", "visible")
               .style("left", (d3.event.pageX - 80) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
        .on("mouseout", function() { label.style("visibility", "hidden");})
        .transition()
        .duration(2000)
        .attr("x", function(d) { return xHist(d[0]); })
        .attr("y", function(d) { return yHist(d[1]); })
        .attr("height", function(d) { return height - yHist(d[1]); })
        .attr("width", xHist.bandwidth());

      // y label
      svgHistogram.append("text")
          .attr("class","textY")
          .attr("id", "histLabelY")
          .attr("transform", "rotate(-90)")
          .attr("y", -50)
          .attr("x", 150 - height/1.2)
          .style("text-anchor", "middle")
          .style("font-size", 24)
          .text("Number of executions");

      // x label
      svgHistogram.append("text")
          .attr("class","textX")
          .attr("id", "histLabelX")
          .style("text-anchor", "middle")
          .style("font-size", 24)
          .attr("y", height + 50)
          .attr("x", width / 2)
          .text("Type of Execution");
  }

  // getting the correct data array based on the year
  function getYear(val, allYears) {
    return allYears[val - 1977];
  }

  // FUnction to pick between single year view and full view
  function onClick() {
    if (click == 0) {
      // full view
      click = 1;
      d3.selectAll("#changeView")
        .text("Single Year View");
      removeTimeSlider()
      updateFullView(copyOfData);
    }
    else {
      //single year view
      click = 0;
      d3.selectAll("#changeView")
        .text("Full View");
      drawTimeSlider()
      updateTimeline(1977, copyOfData);
    }
  }

  function onClickHistogram() {
    if (click == 0) {
      // full view
      click = 1;
      updateFullViewHistogram(copyOfData);
    }
    else {
      //single year view
      click = 0;
      updateHistogram(copyOfData);
    }
  }

  // removing the time slider used in full view
  function removeTimeSlider() {
    d3.select("div#sliderIdTimeline > *").remove()
    d3.select("#timeSliderText").remove()
  }

  // redrawing the entire slider used in single year view
  function drawTimeSlider() {                 
    var slider = d3.sliderHorizontal()
      .min(1977)
      .max(2017)       
      .step(1)
      .width(1000)
      .on('onchange', val => {
        // update plot
        updateTimeline(val, allYears);
      });
  
    var g = d3.select("div#sliderIdTimeline").append("svg")
      .attr("width", 1300)
      .attr("height", 100)
      .attr("font-size", 10)
      .attr("font-family", "calibri")
      .append("g")
      .attr("transform", "translate(200,0)");

    return g.call(slider);
  }

  

  function xAgeRace() {
        makeData();
        svgStacked.selectAll(".RaceState").remove();
        svgStacked.selectAll(".AgeRace").remove();
        svgStacked.selectAll("#xaxis").remove();
        svgStacked.selectAll("#yaxis").remove();
        svgStacked.selectAll("#xLabelScatter").remove();
        svgStacked.selectAll("#yLabelScatter").remove();
        svgStacked.selectAll(".xAxis").remove();
        svgStacked.selectAll(".yAxis").remove();
        svgStacked.selectAll("circle").remove();
        svgStacked.selectAll(".bar").remove();
        svgStacked.selectAll(".bar1").remove();

        xStacked = d3.scaleBand().rangeRound([0, widthScatter]).padding(0.5);
        xStacked.domain(races);

        yStacked = d3.scaleLinear().rangeRound([heightScatter, 0]);
        yStacked.domain([0, 850]);

        xAxisStacked = d3.axisBottom()
          .scale(xStacked);

        yAxisStacked = d3.axisLeft()
          .scale(yStacked);

        // x - axis
        svgStacked.append("g")
          .attr("class", "xAxis")
          .attr("transform", "translate(0," + heightScatter + ")")
          .style("font-size", 16)
          .call(xAxisStacked);

        svgStacked.append("text")
          .attr("class","textX")
          .attr("id", "xLabelScatter")
          .style("text-anchor", "middle")
          .attr("y", heightScatter + 60)
          .attr("x", widthScatter / 2)
          .attr("font-size", 24)
          .text("Race of convicted");
        //y-axis
        svgStacked.append("g")
          .attr("class", "yAxis")
          .style("font-size", 16)
          .call(yAxisStacked);

        // y label
        svgStacked.append("text")
          .attr("class","textY")
          .attr("id", "yLabelScatter")
          .attr("transform", "rotate(-90)")
          .attr("font-size", 24)
          .attr("y", -75)
          .attr("x", 100 - height)
          .style("text-anchor", "middle")
          .text("Total number of convicted people");

        svgStacked.append("rect")
          .attr("class", "AgeRace")
          .attr("y",70)
          .attr("x",590)
          .attr("height", "25%")
          .attr("width", 160)
          .attr("rx", 20)
          .attr("ry", 20)
          .attr("fill", "lightgray");
        svgStacked.append("text")
        .attr("class", "AgeRace")
          .attr("y", 100)
          .attr("font-family", "calibri")
          .attr("font-size", 30)
          .attr("x", 600)
          .style("fill", "blue")
          .text("Age 20 - 29");
        svgStacked.append("text")
        .attr("class", "AgeRace")
          .attr("font-family", "calibri")
          .attr("font-size", 30)
          .attr("y", 130)
          .attr("x", 600)
          .style("fill", "tomato")
          .text("Age 30 - 39");
        svgStacked.append("text")
        .attr("class", "AgeRace")
          .attr("y", 160)
          .attr("x", 600)
          .attr("font-family", "calibri")
          .attr("font-size", 30)
          .style("fill", "green")
          .text("Age 40 - 49");
        svgStacked.append("text")
        .attr("class", "AgeRace")
          .attr("y", 190)
          .attr("x", 600)
          .attr("font-family", "calibri")
          .attr("font-size", 30)
          .style("fill", "Steelblue")
          .text("Age 50 - 59");
        svgStacked.append("text")
        .attr("class", "AgeRace")
          .attr("y", 220)
          .attr("x", 600)
          .attr("font-family", "calibri")
          .attr("font-size", 30)
          .style("fill", "yellow")
          .text("Age 60 - 69");
        svgStacked.append("text")
        .attr("class", "AgeRace")
          .attr("y", 250)
          .attr("x", 600)
          .attr("font-family", "calibri")
          .attr("font-size", 30)
          .style("fill", "black")
          .text("Age  > 70");


        // drawing the individual bars
        // white

        for (i=0;i<6;i++) {
          for (j=0;j<6;j++) {
            yStacked_value = yStacked((copyOfRaceAge[i][1].slice(0,j+1)).reduce(add,0));  
          
          svgStacked.selectAll(".bar")
          .data(copyOfRaceAge)
          .enter()
          .append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceAge[i][1][0] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xStacked(copyOfRaceAge[i][0]))
          .attr("y", function(d) { return yStacked_value; } )
          .attr("height", function(d) { return heightScatter - yStacked(copyOfRaceAge[i][1][j]); })
          .attr("width", xStacked.bandwidth())
          .attr("fill", colors6[j]);

        }
      }
  }

  function xRaceState() {
        makeData();
        svgStacked.selectAll(".RaceState").remove();
        svgStacked.selectAll(".AgeRace").remove();
        svgStacked.selectAll("#xaxis").remove();
        svgStacked.selectAll("#yaxis").remove();
        svgStacked.selectAll("#xLabelScatter").remove();
        svgStacked.selectAll("#yLabelScatter").remove();
        svgStacked.selectAll(".xAxis").remove();
        svgStacked.selectAll(".yAxis").remove();
        svgStacked.selectAll("circle").remove();
        svgStacked.selectAll(".bar").remove();
        svgStacked.selectAll(".bar1").remove();

        xStacked = d3.scaleBand().rangeRound([0, widthScatter]).padding(0.5);
        xStacked.domain(states);

        yStacked = d3.scaleLinear().rangeRound([heightScatter, 0]);
        yStacked.domain([0, 550]);

        xAxisStacked = d3.axisBottom()
          .scale(xStacked);

        yAxisStacked = d3.axisLeft()
          .scale(yStacked);

        // x - axis
        svgStacked.append("g")
          .attr("class", "xAxis")
          .attr("transform", "translate(0," + heightScatter + ")")
          .style("font-size", 16)
          .call(xAxisStacked);

        svgStacked.append("text")
          .attr("class","textX")
          .attr("id", "xLabelScatter")
          .style("text-anchor", "middle")
          .attr("y", heightScatter + 60)
          .attr("x", widthScatter / 2)
          .attr("font-size", 24)
          .text("State of Execution");
        //y-axis
        svgStacked.append("g")
          .attr("class", "yAxis")
          .style("font-size", 16)
          .call(yAxisStacked);

        // y label
        svgStacked.append("text")
          .attr("class","textY")
          .attr("id", "yLabelScatter")
          .attr("transform", "rotate(-90)")
          .attr("font-size", 24)
          .attr("y", -75)
          .attr("x", 100 - height)
          .style("text-anchor", "middle")
          .text("Total number of convicted people");

        svgStacked.append("rect")
          .attr("class", "RaceState")
          .attr("y",70)
          .attr("x",250)
          .attr("height", "14%")
          .attr("width", 180)
          .attr("rx", 20)
          .attr("ry", 20)
          .attr("fill", "lightgray");
        svgStacked.append("text")
        .attr("class", "RaceState")
          .attr("y", 100)
          .attr("font-family", "calibri")
          .attr("font-size", 30)
          .attr("x", 260)
          .style("fill", "blue")
          .text("Race: White");
        svgStacked.append("text")
        .attr("class", "RaceState")
          .attr("font-family", "calibri")
          .attr("font-size", 30)
          .attr("y", 130)
          .attr("x", 260)
          .style("fill", "tomato")
          .text("Race: Latino");
        svgStacked.append("text")
        .attr("class", "RaceState")
          .attr("y", 160)
          .attr("x", 260)
          .attr("font-family", "calibri")
          .attr("font-size", 30)
          .style("fill", "green")
          .text("Race: Black");


        for (i=0;i<35;i++) {
          for (j=0;j<3;j++) {
            yStacked_value = yStacked((copyOfRaceState[i][1].slice(0,j+1)).reduce(add,0));

          svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[i][1][0] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xStacked(copyOfRaceState[i][0]))
          .attr("y", function(d) { return yStacked_value; } )
          .attr("height", function(d) { return heightScatter - yStacked(copyOfRaceState[i][1][j]); })
          .attr("width", xStacked.bandwidth())
          .attr("fill", colors6[j]);
        }
      }
  }
 
  function xSexAge() {
    svgStacked.selectAll("#xaxis").remove();
    svgStacked.selectAll("#yaxis").remove();
    svgStacked.selectAll("#xLabelScatter").remove();
    svgStacked.selectAll("#yLabelScatter").remove();
    svgStacked.selectAll(".xAxis").remove();
    svgStacked.selectAll(".yAxis").remove();
    svgStacked.selectAll("circle").remove();
    svgStacked.selectAll(".bar").remove();
    svgStacked.selectAll(".bar1").remove();
    svgStacked.selectAll(".AgeRace").remove();
    svgStacked.selectAll(".RaceState").remove();
    makeData();

    xStacked = d3.scaleBand().rangeRound([0, widthScatter]).padding(0.5);
        xStacked.domain(sexes);

        yStacked = d3.scaleLinear().rangeRound([heightScatter, 0]);
        yStacked.domain([0, 1500]);

        xAxisStacked = d3.axisBottom()
          .scale(xStacked);

        yAxisStacked = d3.axisLeft()
          .scale(yStacked);

        // x - axis
        svgStacked.append("g")
          .attr("class", "xAxis")
          .attr("transform", "translate(0," + heightScatter + ")")
          .style("font-size", 16)
          .call(xAxisStacked);

        svgStacked.append("text")
          .attr("class","textX")
          .attr("id", "xLabelScatter")
          .style("text-anchor", "middle")
          .attr("y", heightScatter + 60)
          .attr("x", widthScatter / 2)
          .attr("font-size", 24)
          .text("Sex of convicted");
        //y-axis
        svgStacked.append("g")
          .attr("class", "yAxis")
          .style("font-size", 16)
          .call(yAxisStacked);

        // y label
        svgStacked.append("text")
          .attr("class","textY")
          .attr("id", "yLabelScatter")
          .attr("transform", "rotate(-90)")
          .attr("font-size", 24)
          .attr("y", -75)
          .attr("x", 100 - height)
          .style("text-anchor", "middle")
          .text("Total number of convicted people");

        svgStacked.append("rect")
          .attr("class", "AgeRace")
          .attr("y",70)
          .attr("x",590)
          .attr("height", "25%")
          .attr("width", 160)
          .attr("rx", 20)
          .attr("ry", 20)
          .attr("fill", "lightgray");
        svgStacked.append("text")
        .attr("class", "AgeRace")
          .attr("y", 100)
          .attr("font-family", "calibri")
          .attr("font-size", 30)
          .attr("x", 600)
          .style("fill", "blue")
          .text("Age 20 - 29");
        svgStacked.append("text")
        .attr("class", "AgeRace")
          .attr("font-family", "calibri")
          .attr("font-size", 30)
          .attr("y", 130)
          .attr("x", 600)
          .style("fill", "tomato")
          .text("Age 30 - 39");
        svgStacked.append("text")
        .attr("class", "AgeRace")
          .attr("y", 160)
          .attr("x", 600)
          .attr("font-family", "calibri")
          .attr("font-size", 30)
          .style("fill", "green")
          .text("Age 40 - 49");
        svgStacked.append("text")
        .attr("class", "AgeRace")
          .attr("y", 190)
          .attr("x", 600)
          .attr("font-family", "calibri")
          .attr("font-size", 30)
          .style("fill", "Steelblue")
          .text("Age 50 - 59");
        svgStacked.append("text")
        .attr("class", "AgeRace")
          .attr("y", 220)
          .attr("x", 600)
          .attr("font-family", "calibri")
          .attr("font-size", 30)
          .style("fill", "yellow")
          .text("Age 60 - 69");
        svgStacked.append("text")
        .attr("class", "AgeRace")
          .attr("y", 250)
          .attr("x", 600)
          .attr("font-family", "calibri")
          .attr("font-size", 30)
          .style("fill", "black")
          .text("Age  > 70");

        for (i=0;i<2;i++) {
          for (j=0;j<6;j++) {
            yStacked_value = yStacked((copyOfSexAge[i][1].slice(0,j+1)).reduce(add,0));

        svgStacked.selectAll(".bar")
          .data(copyOfSexAge)
          .enter()
          .append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfSexAge[i][1][0] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xStacked(copyOfSexAge[i][0]))
          .attr("y", function(d) { return yStacked_value; } )
          .attr("height", function(d) { return heightScatter - yStacked(copyOfSexAge[i][1][j]); })
          .attr("width", xStacked.bandwidth())
          .attr("fill", colors6[j]);
        }
      }

  } 

  function xVictimsAge() {
    svgStacked.selectAll("#xaxis").remove();
    svgStacked.selectAll("#yaxis").remove();
    svgStacked.selectAll("#xLabelScatter").remove();
    svgStacked.selectAll("#yLabelScatter").remove();
    svgStacked.selectAll(".xAxis").remove();
    svgStacked.selectAll(".yAxis").remove();
    svgStacked.selectAll("circle").remove();
    svgStacked.selectAll(".bar").remove();
    svgStacked.selectAll(".bar1").remove();
    svgStacked.selectAll(".AgeRace").remove();
    svgStacked.selectAll(".RaceState").remove();
    makeData();

    xStacked = d3.scaleBand().rangeRound([0, widthScatter]).padding(0.6);
    xStacked.domain(["1", "2", "3", "4", "5", "> 5"]);

    yStacked = d3.scaleLinear().rangeRound([heightScatter, 0]);
    yStacked.domain([0, 1100]);

    xAxisStacked = d3.axisBottom()
      .scale(xStacked);

    yAxisStacked = d3.axisLeft()
      .scale(yStacked);

        // x - axis
        svgStacked.append("g")
          .attr("class", "xAxis")
          .attr("transform", "translate(0," + heightScatter + ")")
          .style("font-size", 16)
          .call(xAxisStacked);

        svgStacked.append("text")
          .attr("class","textX")
          .attr("id", "xLabelScatter")
          .style("text-anchor", "middle")
          .attr("y", heightScatter + 60)
          .attr("x", widthScatter / 2)
          .attr("font-size", 24)
          .text("Number of Victims");
        //y-axis
        svgStacked.append("g")
          .attr("class", "yAxis")
          .style("font-size", 16)
          .call(yAxisStacked);

        // y label
        svgStacked.append("text")
          .attr("class","textY")
          .attr("id", "yLabelScatter")
          .attr("transform", "rotate(-90)")
          .attr("font-size", 24)
          .attr("y", -75)
          .attr("x", 100 - height)
          .style("text-anchor", "middle")
          .text("Total number of convicted people");

        svgStacked.append("rect")
          .attr("class", "AgeRace")
          .attr("y",70)
          .attr("x",590)
          .attr("height", "25%")
          .attr("width", 160)
          .attr("rx", 20)
          .attr("ry", 20)
          .attr("fill", "lightgray");
        svgStacked.append("text")
        .attr("class", "AgeRace")
          .attr("y", 100)
          .attr("font-family", "calibri")
          .attr("font-size", 30)
          .attr("x", 600)
          .style("fill", "blue")
          .text("Age 20 - 29");
        svgStacked.append("text")
        .attr("class", "AgeRace")
          .attr("font-family", "calibri")
          .attr("font-size", 30)
          .attr("y", 130)
          .attr("x", 600)
          .style("fill", "tomato")
          .text("Age 30 - 39");
        svgStacked.append("text")
        .attr("class", "AgeRace")
          .attr("y", 160)
          .attr("x", 600)
          .attr("font-family", "calibri")
          .attr("font-size", 30)
          .style("fill", "green")
          .text("Age 40 - 49");
        svgStacked.append("text")
        .attr("class", "AgeRace")
          .attr("y", 190)
          .attr("x", 600)
          .attr("font-family", "calibri")
          .attr("font-size", 30)
          .style("fill", "Steelblue")
          .text("Age 50 - 59");
        svgStacked.append("text")
        .attr("class", "AgeRace")
          .attr("y", 220)
          .attr("x", 600)
          .attr("font-family", "calibri")
          .attr("font-size", 30)
          .style("fill", "yellow")
          .text("Age 60 - 69");
        svgStacked.append("text")
        .attr("class", "AgeRace")
          .attr("y", 250)
          .attr("x", 600)
          .attr("font-family", "calibri")
          .attr("font-size", 30)
          .style("fill", "black")
          .text("Age  > 70");

        for(i=0;i<6;i++) {
          for(j=0;j<6;j++) {
            yStacked_value = yStacked((copyOfVictimsAge[i][1].slice(0,j+1)).reduce(add,0));        
            svgStacked.selectAll(".bar")
              .data(copyOfVictimsAge)
              .enter()
              .append("rect")
              .on("mouseover", function(d) {   
                labelScatter.style("opacity", 1); 
                labelScatter.html("" + copyOfVictimsAge[i][1][0] + "");
                labelScatter.style("visibility", "visible")
                   .style("left", (d3.event.pageX - 30) + "px")
                   .style("top", (d3.event.pageY - 60) + "px"); })
              .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
              .transition()
              .duration(2000)
              .attr("class", "bar")
              .attr("x", xStacked(copyOfVictimsAge[i][0]))
              .attr("y", function(d) {return yStacked_value;})
              .attr("height", function(d) { return heightScatter - yStacked(copyOfVictimsAge[i][1][j]); })
              .attr("width", xStacked.bandwidth())
              .attr("fill", colors6[j]);
          
          }
        }
    }


  function calculateVictims(data) {
    var aString = data["Number / Race / Sex of Victims"];
    var sumVictims = aString.match(/\d+/g).map(Number).reduce((a, b) => a + b, 0);
    return sumVictims; // no scaling for histogram
  }

  // Calculates all the data we need when drawing stacked histograms
  function makeData() {

        resetVariables()
        var raceData = d3.nest()
          .key(function(d) { return d.Race; })
          .entries(copyOfData);

        var stateData = d3.nest()
          .key(function(d) { return d.State; })
          .entries(copyOfData); 

        var sexAgeData = d3.nest()
          .key(function(d) { return d.Sex; })
          .entries(copyOfData);

        victimsAgeData = d3.nest()
          .key(function(d) { return calculateVictims(d); })
          .entries(copyOfData);

        

        race_age = [];
        for(x=0;x<6;x++) {
          race_age.push(new Array());
          for(y=0;y<6;y++) {
            race_age[x].push(new Array());
          }
        }
        for (j = 0; j < raceData.length; j++) {  
          for (i = 0; i < raceData[j].values.length; i++) {
              num = Number(raceData[j].values[i].Age.substring(0,1)) - 2;
              race_age[j][num].push(raceData[j].values[i])
  
          }
        }

        state_race = [];
        for(x=0;x<35;x++) {
          state_race.push(new Array());
          for(y=0;y<3;y++) {
            state_race[x].push(0);
          }
        }

        for (j = 0; j < stateData.length; j++) { 
          for (i = 0; i < stateData[j].values.length; i++) {

              if (stateData[j].values[i].Race == "White") {
                state_race[j][0]++;
              }
              if (stateData[j].values[i].Race == "Latino") {

                state_race[j][1]++;
              }
              if (stateData[j].values[i].Race == "Black") {
                state_race[j][2]++;
              }
          }
        }

        sex_age = [];
        for(x=0;x<2;x++) {
          sex_age.push(new Array());
          for(y=0;y<6;y++) {
            sex_age[x].push(0);
          }
        }

        for (j = 0; j < sexAgeData.length; j++) {
          sex_age.push(new Array());
          for (i = 0; i < sexAgeData[j].values.length; i++) {
              num = Number(sexAgeData[j].values[i].Age.substring(0,1)) - 2;
              sex_age[j][num]++;
            }
          }

          victims_age = [];
          for(x=0;x<6;x++) {
            victims_age.push(new Array());
            for(y=0;y<6;y++) {
              victims_age[x].push(0);
            }
          }

          for (j = 0; j < victimsAgeData.length; j++) {  
            for (i = 0; i < victimsAgeData[j].values.length; i++) {
              
              num_victims = victimsAgeData[j].key;
              if (num_victims>5) {
                num_victims = 5;
              }
              num = Number(victimsAgeData[j].values[i].Age.substring(0,1)) - 2;
              victims_age[num_victims-1][num]++;

            }
          }


        var victimsAgeData = victims_age;
        var sexAgeData = sex_age;

        var raceAgeData = [];
        for (i=0;i<6;i++){
          raceAgeData.push(new Array());
          for (j=0;j<6;j++){
            raceAgeData[i].push(race_age[i][j].length);
            }
        }

        
        var raceStateData2 = [];
        for (i=0;i<35;i++){
          raceStateData2.push(new Array());
          for (j=0;j<3;j++){
            raceStateData2[i].push(state_race[i][j].length);
            }
        }
        var raceStateData = state_race;
            
        // place data in a neat way when drawing the bar chart.
        var raceAgePlot = [];
        var raceStatePlot = [];
        var sexAgePlot = [];
        var victimsAgePlot = [];

        for (i = 0; i < raceAgeData.length; i++) {
            raceAgePlot[i] = [races[i], raceAgeData[i]];
        }
        
        for (i = 0; i < raceStateData.length; i++) {
            raceStatePlot[i] = [states[i], raceStateData[i]];
        }

        for (i = 0; i < sexAgeData.length; i++) {
            sexAgePlot[i] = [sexes[i], sexAgeData[i]];
        }

        for (i = 0; i < victimsAgeData.length; i++) {
            victimsAgePlot[i] = [victimsBand[i], victimsAgeData[i]];
        }
        copyOfRaceAge = raceAgePlot;
        copyOfRaceState = raceStatePlot;
        copyOfSexAge = sexAgePlot;
        copyOfVictimsAge = victimsAgePlot;
  } //makeData() ends here

  // as the name implies.
  // We need to reset in order not to add extra data for histogram heights
  function resetVariables() {
        copyOfRaceAge = null;
        copyOfRaceState = null;
        copyOfSexAge = null;
        copyOfVictimsAge = null;
        // Race Age variables
        
  } // resetVariables() end here

  function add(a, b) {
    return a + b;
  }

} // init function end
