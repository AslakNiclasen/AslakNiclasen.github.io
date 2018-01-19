d3.select(window).on('load', init);

var copyOfData = null;
var copyOfRaceState = null;

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
  var xScatter = d3.scaleTime().range([0, widthScatter]);
  var yScatter = d3.scaleLinear().rangeRound([heightScatter, 0]);

  var xAxisScatter = d3.axisBottom()
    .scale(xScatter);

  var yAxisScatter = d3.axisLeft()
    .scale(yScatter);  

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

  var initxScatter = d3.scaleTime().range([0, widthScatter]);
  var inityScatter = d3.scaleLinear().rangeRound([heightScatter, 0]);
  var initXdomain = initxScatter.domain([mindate, maxdate]);
  var initYdomain = inityScatter.domain([0, 80]);

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
      
      var index = 0;
      data.forEach(function(d) {
        index = index + 1;
        if (d.Date.substring(6,10) == 1977) {  
          year1977.push(d);
        }
        else if (d.Date.substring(6,10) == 1978) {  
          year1978.push(d);
        }
        else if (d.Date.substring(6,10) == 1979) {  
          year1979.push(d);
        }
        else if (d.Date.substring(6,10) == 1980) {  
          year1980.push(d);
        }
        else if (d.Date.substring(6,10) == 1981) {  
          year1981.push(d);
        }
        else if (d.Date.substring(6,10) == 1982) {  
          year1982.push(d);
        }
        else if (d.Date.substring(6,10) == 1983) {  
          year1983.push(d);
        }
        else if (d.Date.substring(6,10) == 1984) {  
          year1984.push(d);
        }
        else if (d.Date.substring(6,10) == 1985) {  
          year1985.push(d);
        }
        else if (d.Date.substring(6,10) == 1986) {  
          year1986.push(d);
        }
        else if (d.Date.substring(6,10) == 1987) {  
          year1987.push(d);
        }
        else if (d.Date.substring(6,10) == 1988) {  
          year1988.push(d);
        }
        else if (d.Date.substring(6,10) == 1989) {  
          year1989.push(d);
        }
        else if (d.Date.substring(6,10) == 1990) {  
          year1990.push(d);
        }
        else if (d.Date.substring(6,10) == 1991) {  
          year1991.push(d);
        }
        else if (d.Date.substring(6,10) == 1992) {  
          year1992.push(d);
        }
        else if (d.Date.substring(6,10) == 1993) {  
          year1993.push(d);
        }
        else if (d.Date.substring(6,10) == 1994) {  
          year1994.push(d);
        }
        else if (d.Date.substring(6,10) == 1995) {  
          year1995.push(d);
        }
        else if (d.Date.substring(6,10) == 1996) {  
          year1996.push(d);
        }
        else if (d.Date.substring(6,10) == 1997) {  
          year1997.push(d);
        }
        else if (d.Date.substring(6,10) == 1998) {  
          year1998.push(d);
        }
        else if (d.Date.substring(6,10) == 1999) {  
          year1999.push(d);
        }
        else if (d.Date.substring(6,10) == 2000) {  
          year2000.push(d);
        }
        else if (d.Date.substring(6,10) == 2001) {  
          year2001.push(d);
        }
        else if (d.Date.substring(6,10) == 2002) {  
          year2002.push(d);
        }
        else if (d.Date.substring(6,10) == 2003) {  
          year2003.push(d);
        }
        else if (d.Date.substring(6,10) == 2004) {  
          year2004.push(d);
        }
        else if (d.Date.substring(6,10) == 2005) {  
          year2005.push(d);
        }
        else if (d.Date.substring(6,10) == 2006) {  
          year2006.push(d);
        }
        else if (d.Date.substring(6,10) == 2007) {  
          year2007.push(d);
        }
        else if (d.Date.substring(6,10) == 2008) {  
          year2008.push(d);
        }
        else if (d.Date.substring(6,10) == 2009) {  
          year2009.push(d);
        }
        else if (d.Date.substring(6,10) == 2010) {  
          year2010.push(d);
        }
        else if (d.Date.substring(6,10) == 2011) {  
          year2011.push(d);
        }
        else if (d.Date.substring(6,10) == 2012) {  
          year2012.push(d);
        }
        else if (d.Date.substring(6,10) == 2013) {  
          year2013.push(d);
        }
        else if (d.Date.substring(6,10) == 2014) {  
          year2014.push(d);
        }
        else if (d.Date.substring(6,10) == 2015) {  
          year2015.push(d);
        }
        else if (d.Date.substring(6,10) == 2016) {  
          year2016.push(d);
        }
        else if (d.Date.substring(6,10) == 2017) {  
          year2017.push(d);
        }
      }); 

      allYears = [
        year1977, year1978, year1979, year1980, year1981, year1982, year1983, year1984,
        year1985, year1986, year1987, year1988, year1989, year1990, year1991, year1992,
        year1993, year1994, year1995, year1996, year1997, year1998, year1999, year2000,
        year2001, year2002, year2003, year2004, year2005, year2006, year2007, year2008,
        year2009, year2010, year2011, year2012, year2013, year2014, year2015, year2016,
        year2017 ];

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

      // STACKE BARCHART START INITIAL SCATTERPLOT CONTAINS AGE AND DATE - STACKED BARCHART
      mindate = new Date(1977,0,1);
      maxdate = new Date(2017,11,31);
      xScatter.domain([mindate, maxdate])
      yScatter.domain([0,maxAge])
      
      // x Axis Scatter
      svgStacked.append("g")
        .attr("class", "axis")
        .attr("id", "xaxis")
        .attr("transform", "translate(0," + heightScatter + ")")
        .call(d3.axisBottom(xScatter)
                .tickFormat(d3.timeFormat("%d-%b-%Y")))
        .selectAll("text")  
        .style("text-anchor", "center")
        .attr("font-size", 14)
        .attr("dx", "0em")
        .attr("dy", "2em");

      // x label
      svgStacked.append("text")
        .attr("class","textX")
        .attr("id", "xLabelScatter")
        .style("text-anchor", "middle")
        .attr("y", heightScatter + 90)
        .attr("x", widthScatter / 2)
        .attr("font-size", 24)
        .text("Date of execution");

      // y Axis
      svgStacked.append("g")
        .attr("class", "axis")
        .attr("id", "yaxis")
        .call(d3.axisLeft(yScatter))
        .selectAll("text")
          .attr("font-size", 14);

      // y label
      svgStacked.append("text")
        .attr("class","textY")
        .attr("id", "yLabelScatter")
        .attr("transform", "rotate(-90)")
        .attr("y", -60)
        .attr("x", 400 - heightScatter)
        .attr("font-size", 24)
        .style("text-anchor", "middle")
        .text("Age of the convicted");

      svgStacked.selectAll(".dot")
        .data(copyOfData)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("stroke", function(d) { return pickCircleColor(d); })
        .attr("stroke-width", 2)
        .attr("fill", "none") // no filling due to occlusion
        .attr("opacity", 0.5)
        .attr("r", 4) // fixed sizes in scatterplot
        .attr("cx", function(d) { d1 = d
                                  if (parseTime(d.Date) == null) {
                                    d.Date = formatTime(d1.Date);
                                    d.Date = parseTime(d.Date)
                                    return xScatter(d.Date);
                                  }
                                  else {
                                    d.Date = parseTime(d.Date)
                                    return xScatter(d.Date);
                                  }})
        .attr("cy", function(d) { return yScatter(d.Age); });
    
      // mapping of each category for stacked barCHart
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
      d3.select('#xAgeRace')
        .on("click", xAgeRace);
      d3.select('#xRaceState')
        .on("click", xRaceState);       
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
      yHist.domain([0, 1400]); 
      
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
      console.log("full view");
      removeTimeSlider()
      updateFullView(copyOfData);
    }
    else {
      //single year view
      click = 0;
      console.log("single year view");
      drawTimeSlider()
      updateTimeline(1977, copyOfData);
    }
  }

  function onClickHistogram() {
    if (click == 0) {
      // full view
      click = 1;
      console.log("full view histogram");
      updateFullViewHistogram(copyOfData);
    }
    else {
      //single year view
      click = 0;
      console.log("single year view histogram");
      updateHistogram(copyOfData);
    }
  }

  // removing the time slider used in full view
  function removeTimeSlider() {
    console.log("removing slider")
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

  // scatterplot dropdown functions
  // drawing the data based on the picked item
  function xAge() {
        svgStacked.selectAll("#xaxis").remove();
        svgStacked.selectAll(".AgeRace").remove();
        svgStacked.selectAll("#yaxis").remove();
        svgStacked.selectAll("#xLabelScatter").remove();
        svgStacked.selectAll("#yLabelScatter").remove();
        svgStacked.selectAll(".xAxis").remove();
        svgStacked.selectAll(".yAxis").remove();
        svgStacked.selectAll("circle").remove();
        svgStacked.selectAll(".bar").remove();
        svgStacked.selectAll(".bar1").remove();
        svgStacked.selectAll(".RaceState").remove();

        //yScatterCounter = 100; // barplot
        xScatter = d3.scaleBand().rangeRound([0, widthScatter]).padding(0.6);
        xScatter.domain(agesBand);

        yScatter = d3.scaleLinear().rangeRound([heightScatter, 0]);
        yScatter.domain([0, 600]);

        xAxisScatter = d3.axisBottom()
          .scale(xScatter);

        yAxisScatter = d3.axisLeft()
          .scale(yScatter);

        ageData = d3.nest()
              .key(function(d) { return d.Age; })
                .entries(copyOfData);
 
        // an array containing the individually arrays of a given age within the bins
        // i.e. a1 contains a set of arrays which has data where the age is between 20 and 29.
        
        a1Length = 0;
        a2Length = 0;
        a3Length = 0;
        a4Length = 0;
        a5Length = 0;
        a6Length = 0;

        for (j = 0; j < ageData.length; j++) {
          if (tt.includes(Number(ageData[j].key)) == true) {
            a1Length = a1Length + ageData[j].values.length;
          }
          if (tf.includes(Number(ageData[j].key)) == true) {
            a2Length = a2Length + ageData[j].values.length;
          }
          if (ff.includes(Number(ageData[j].key)) == true) {
            a3Length = a3Length + ageData[j].values.length;
          }
          if (fs.includes(Number(ageData[j].key)) == true) {
            a4Length = a4Length + ageData[j].values.length;
          }
          if (se.includes(Number(ageData[j].key)) == true) {
            a6Length = a6Length + ageData[j].values.length;
          }
          if (ss.includes(Number(ageData[j].key)) == true) {
            a5Length = a5Length + ageData[j].values.length;
          }
        }
        
        //console.log(a1.length);
        var ageData1 = [];
        var ageData =  [a1Length, a2Length, a3Length, a4Length, a5Length, a6Length];
        var agePlot = [];
        for (i = 0; i < ageData.length; i++) {
            agePlot[i] = [agesBand[i], ageData[i]];
        }

        // x - axis
        svgStacked.append("g")
          .attr("class", "xAxis")
          .attr("transform", "translate(0," + heightScatter + ")")
          .style("font-size", 16)
          .call(xAxisScatter);

        svgStacked.append("text")
          .attr("class","textX")
          .attr("id", "xLabelScatter")
          .style("text-anchor", "middle")
          .attr("y", heightScatter + 60)
          .attr("x", widthScatter / 2)
          .attr("font-size", 24)
          .text("Age of convicted");

        //y-axis
        svgStacked.append("g")
          .attr("class", "yAxis")
          .style("font-size", 16)
          .call(yAxisScatter);

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

        // drawing the individual bars
        svgStacked.selectAll(".bar")
          .data(agePlot)
          .enter()
          .append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + d[1] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(1000)
          .attr("class", "bar1")
          .attr("x", function(d) { return xScatter(d[0]); })
          .attr("y", function(d) { return yScatter(d[1]); })
          .attr("height", function(d) { return heightScatter - yScatter(d[1]); })
          .attr("width", xScatter.bandwidth())
  }

  function xRace() {
        svgStacked.selectAll("#xaxis").remove();
        svgStacked.selectAll(".AgeRace").remove();
        svgStacked.selectAll("#yaxis").remove();
        svgStacked.selectAll("#xLabelScatter").remove();
        svgStacked.selectAll("#yLabelScatter").remove();
        svgStacked.selectAll(".xAxis").remove();
        svgStacked.selectAll(".yAxis").remove();
        svgStacked.selectAll("circle").remove();
        svgStacked.selectAll(".bar").remove();
        svgStacked.selectAll(".bar1").remove();
        svgStacked.selectAll(".RaceState").remove();

        makeData()

        r1 = d3.sum(copyOfRaceAge[0][1]);
        r2 = d3.sum(copyOfRaceAge[1][1]);
        r3 = d3.sum(copyOfRaceAge[2][1]);
        r4 = d3.sum(copyOfRaceAge[3][1]);
        r5 = d3.sum(copyOfRaceAge[4][1]);
        r6 = d3.sum(copyOfRaceAge[5][1]);

        var raceDataNew = [];
        var raceDataNew =  [r1, r2, r3, r4, r5, r6];
        var racePlot = [];
        for (i = 0; i < raceDataNew.length; i++) {
            racePlot[i] = [races[i], raceDataNew[i]];
        }

        // currently showing Race against ages.
        xScatter = d3.scaleBand().rangeRound([0, widthScatter]).padding(0.5);
        xScatter.domain(races);

        yScatter = d3.scaleLinear().rangeRound([heightScatter, 0]);
        yScatter.domain([0, 850]);

        xAxisScatter = d3.axisBottom()
          .scale(xScatter);

        yAxisScatter = d3.axisLeft()
          .scale(yScatter);

        // x - axis
        svgStacked.append("g")
          .attr("class", "xAxis")
          .attr("transform", "translate(0," + heightScatter + ")")
          .style("font-size", 16)
          .call(xAxisScatter);

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
          .call(yAxisScatter);

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

        svgStacked.selectAll(".bar")
          .data(racePlot)
          .enter()
          .append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + d[1] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", function(d) { return xScatter(d[0]); })
          .attr("y", function(d) { return yScatter(d[1]); } )
          .attr("height", function(d) { return heightScatter - yScatter(d[1]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "green");
  }

  function xSex() {  
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

        xScatter = d3.scaleBand().rangeRound([0, widthScatter]).padding(0.5);
        xScatter.domain(sexes);

        yScatter = d3.scaleLinear().rangeRound([heightScatter, 0]);
        yScatter.domain([0, 1465]);

        xAxisScatter = d3.axisBottom()
          .scale(xScatter);

        yAxisScatter = d3.axisLeft()
          .scale(yScatter);

        sexData = d3.nest()
              .key(function(d) { return d.Sex; })
                .entries(copyOfData);
        // bar heights for histogram
        var sex1 = sexData[0].values.length;
        var sex2 = sexData[1].values.length;

        var sexData =  [sex1, sex2];
        
        // place data in a neat way when drawing the bar chart.
        var sexPlot = [];
        for (i = 0; i < sexData.length; i++) {
            sexPlot[i] = [sexes[i], sexData[i]];
        }

        // x - axis
        svgStacked.append("g")
          .attr("class", "xAxis")
          .attr("transform", "translate(0," + heightScatter + ")")
          .style("font-size", 16)
          .call(xAxisScatter);

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
          .call(yAxisScatter);

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

        // drawing the individual bars
        svgStacked.selectAll(".bar")
          .data(sexPlot)
          .enter()
          .append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + d[1] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(1000)
          .attr("class", "bar1")
          .attr("x", function(d) { return xScatter(d[0]); })
          .attr("y", function(d) { return yScatter(d[1]); })
          .attr("height", function(d) { return heightScatter - yScatter(d[1]); })
          .attr("width", xScatter.bandwidth())
  }

  function xState() {
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

          
        xScatter = d3.scaleBand().rangeRound([0, widthScatter]).padding(0.5);
        xScatter.domain(states);

        yScatter = d3.scaleLinear().rangeRound([heightScatter, 0]);
        yScatter.domain([0, 550]);
        
        xAxisScatter = d3.axisBottom()
          .scale(xScatter);
        
        yAxisScatter = d3.axisLeft()
          .scale(yScatter);

        stateData = d3.nest()
              .key(function(d) { return d.State; })
              .entries(copyOfData);
        
        // bar heights for histogram
        var s0 = stateData[0].values.length;
        var s1 = stateData[1].values.length;
        var s2 = stateData[2].values.length;
        var s3 = stateData[3].values.length;
        var s4 = stateData[4].values.length;
        var s5 = stateData[5].values.length;
        var s6 = stateData[6].values.length;
        var s7 = stateData[7].values.length;
        var s8 = stateData[8].values.length;
        var s9 = stateData[9].values.length;
        var s10 = stateData[10].values.length;
        var s11 = stateData[11].values.length;
        var s12 = stateData[12].values.length;
        var s13 = stateData[13].values.length;
        var s14 = stateData[14].values.length;
        var s15 = stateData[15].values.length;
        var s16 = stateData[16].values.length;
        var s17 = stateData[17].values.length;
        var s18 = stateData[18].values.length;
        var s19 = stateData[19].values.length;
        var s20 = stateData[20].values.length;
        var s21 = stateData[21].values.length;
        var s22 = stateData[22].values.length;
        var s23 = stateData[23].values.length;
        var s24 = stateData[24].values.length;
        var s25 = stateData[25].values.length;
        var s26 = stateData[26].values.length;
        var s27 = stateData[27].values.length;
        var s28 = stateData[28].values.length;
        var s29 = stateData[29].values.length;
        var s30 = stateData[30].values.length;
        var s31 = stateData[31].values.length;
        var s32 = stateData[32].values.length;
        var s33 = stateData[33].values.length;
        var s34 = stateData[34].values.length;
        console.log(stateData)
        console.log(states)
        var statesNew = []
        
        for (j = 0; j < stateData.length; j++) {
          statesNew[j] = stateData[j].key;
        }
        
        var statePlot = [];
        for (i = 0; i < stateData.length; i++) {
            statePlot[i] = [statesNew[i], stateData[i]];
        }

        // x - axis
        svgStacked.append("g")
          .attr("class", "xAxis")
          .attr("transform", "translate(0," + heightScatter + ")")
          .style("font-size", 14)
          .call(xAxisScatter);

        svgStacked.append("text")
          .attr("class","textX")
          .attr("id", "xLabelScatter")
          .style("text-anchor", "middle")
          .attr("y", heightScatter + 60)
          .attr("x", widthScatter / 2)
          .attr("font-size", 24)
          .text("State of execution");

        //y-axis
        svgStacked.append("g")
          .attr("class", "yAxis")
          .style("font-size", 16)
          .call(yAxisScatter);

                // y label
        svgStacked.append("text")
          .attr("class","textY")
          .attr("id", "yLabelScatter")
          .attr("transform", "rotate(-90)")
          .attr("font-size", 24)
          .attr("y", heightScatter - 725)
          .attr("x", 100 - height)
          .style("text-anchor", "middle")
          .text("Total number of convicted people");

         // drawing the individual bars
        svgStacked.selectAll(".bar")
          .data(statePlot)
          .enter()
          .append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + d[1] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(1000)
          .attr("class", "bar1")
          .attr("x", function(d) {return xScatter(d[0]); })
          .attr("y", function(d) { return yScatter(d[1]); })
          .attr("height", function(d) { return heightScatter - yScatter(d[1]); })
          .attr("width", xScatter.bandwidth())
  }

  function xType() {
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

        //yScatterCounter = 100; // barplot
        xScatter = d3.scaleBand().rangeRound([0, widthScatter]).padding(0.5);
        xScatter.domain(method);

        yScatter = d3.scaleLinear().rangeRound([heightScatter, 0]);
        yScatter.domain([0, 1200]);

        xAxisScatter = d3.axisBottom()
          .scale(xScatter);

        yAxisScatter = d3.axisLeft()
          .scale(yScatter);

        typeData = d3.nest()
              .key(function(d) { return d.Method; })
                .entries(copyOfData);

        // bar heights for histogram
        var sumElectrocutions1 = typeData[0].values.length;
        var sumLethalInjection1 = typeData[1].values.length;
        var sumHanging1 = typeData[2].values.length;
        var sumGasChamber1 = typeData[3].values.length;
        var sumFiringSquad1 = typeData[4].values.length;
        var typeData =  [sumElectrocutions1, sumLethalInjection1, sumHanging1, sumGasChamber1, sumFiringSquad1];
        
        // place data in a neat way when drawing the bar chart.
        var typePlot = [];
        for (i = 0; i < typeData.length; i++) {
            typePlot[i] = [method[i], typeData[i]];
        }
        // x - axis
        svgStacked.append("g")
          .attr("class", "xAxis")
          .attr("transform", "translate(0," + heightScatter + ")")
          .style("font-size", 16)
          .call(xAxisScatter);

        svgStacked.append("text")
          .attr("class","textX")
          .attr("id", "xLabelScatter")
          .style("text-anchor", "middle")
          .attr("y", heightScatter + 60)
          .attr("x", widthScatter / 2)
          .attr("font-size", 24)
          .text("Type of execution");
        //y-axis
        svgStacked.append("g")
          .attr("class", "yAxis")
          .style("font-size", 16)
          .call(yAxisScatter);

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

        // drawing the individual bars
        svgStacked.selectAll(".bar")
          .data(typePlot)
          .enter()
          .append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + d[1] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(1000)
          .attr("class", "bar1")
          .attr("x", function(d) { return xScatter(d[0]); })
          .attr("y", function(d) { if (yScatterCounter == 1 || 
                                       yScatterCounter == 100) { 
                                          return yScatter(d[1]);
                                    }
                                  })
          .attr("height", function(d) { return heightScatter - yScatter(d[1]); })
          .attr("width", xScatter.bandwidth())

          // add labels also
  }

  function xVictim() {
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

        //yScatterCounter = 100; // barplot
        xScatter = d3.scaleBand().rangeRound([0, widthScatter]).padding(0.6);
        xScatter.domain(["1", "2", "3", "4", "5", "> 5"]);

        yScatter = d3.scaleLinear().rangeRound([heightScatter, 0]);
        yScatter.domain([0, 1100]);

        xAxisScatter = d3.axisBottom()
          .scale(xScatter);

        yAxisScatter = d3.axisLeft()
          .scale(yScatter);

        victimsData = d3.nest()
              .key(function(d) { return calculateVictims(d); })
                .entries(copyOfData);

        victimsX = ["1","2","3","4","5","> 5"];
        v1 = 0;
        v2 = 0;
        v3 = 0;
        v4 = 0;
        v5 = 0;
        v6 = 0;

        for (j = 0; j < victimsData.length; j++) {
          if (Number(victimsData[j].key) == 1) {
            v1 = v1 + victimsData[j].values.length;
          }
          if (Number(victimsData[j].key) == 2) {
            v2 = v2 + victimsData[j].values.length;
          }
          if (Number(victimsData[j].key) == 3) {
            v3 = v3 + victimsData[j].values.length;
          }
          if (Number(victimsData[j].key) == 4) {
            v4 = v4 + victimsData[j].values.length;
          }
          if (Number(victimsData[j].key) == 5) {
            v5 = v5 + victimsData[j].values.length;
          }
          if (Number(victimsData[j].key) == 5) {
            v6 = v6 + victimsData[j].values.length;}
        }

        var victimsData =  [v1, v2, v3, v4, v5, v6];
        var victimsPlot = [];
        for (i = 0; i < victimsData.length; i++) {
            victimsPlot[i] = [victimsX[i], victimsData[i]];
        }
        
        // x - axis
        svgStacked.append("g")
          .attr("class", "xAxis")
          .attr("transform", "translate(0," + heightScatter + ")")
          .style("font-size", 16)
          .call(xAxisScatter);

        svgStacked.append("text")
          .attr("class","textX")
          .attr("id", "xLabelScatter")
          .style("text-anchor", "middle")
          .attr("y", heightScatter + 60)
          .attr("x", widthScatter / 2)
          .attr("font-size", 24)
          .text("Number of victims");
        
        //y-axis
        svgStacked.append("g")
          .attr("class", "yAxis")
          .style("font-size", 16)
          .call(yAxisScatter);

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

        // drawing the individual bars
        svgStacked.selectAll(".bar")
          .data(victimsPlot)
          .enter()
          .append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + d[1] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(1000)
          .attr("class", "bar1")
          .attr("x", function(d) { return xScatter(d[0]); })
          .attr("y", function(d) { return yScatter(d[1]); })
          .attr("height", function(d) { return heightScatter - yScatter(d[1]); })
          .attr("width", xScatter.bandwidth())
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

        xScatter = d3.scaleBand().rangeRound([0, widthScatter]).padding(0.5);
        xScatter.domain(races);

        yScatter = d3.scaleLinear().rangeRound([heightScatter, 0]);
        yScatter.domain([0, 850]);

        xAxisScatter = d3.axisBottom()
          .scale(xScatter);

        yAxisScatter = d3.axisLeft()
          .scale(yScatter);

        // x - axis
        svgStacked.append("g")
          .attr("class", "xAxis")
          .attr("transform", "translate(0," + heightScatter + ")")
          .style("font-size", 16)
          .call(xAxisScatter);

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
          .call(yAxisScatter);

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
          .attr("width", "75%")
          .attr("fill", "gray");
        svgStacked.append("text")
        .attr("class", "AgeRace")
          .attr("y", 100)
          .attr("font-family", "calibri")
          .attr("font-size", 30)
          .attr("x", 600)
          .style("fill", "blue")
          .text("Blue - ages 20 - 29");
        svgStacked.append("text")
        .attr("class", "AgeRace")
          .attr("font-family", "calibri")
          .attr("font-size", 30)
          .attr("y", 130)
          .attr("x", 600)
          .style("fill", "tomato")
          .text("Red - ages 30 - 39");
        svgStacked.append("text")
        .attr("class", "AgeRace")
          .attr("y", 160)
          .attr("x", 600)
          .attr("font-family", "calibri")
          .attr("font-size", 30)
          .style("fill", "green")
          .text("Green - ages 40 - 49");
        svgStacked.append("text")
        .attr("class", "AgeRace")
          .attr("y", 190)
          .attr("x", 600)
          .attr("font-family", "calibri")
          .attr("font-size", 30)
          .style("fill", "Steelblue")
          .text("Lightblue - ages 50 - 59");
        svgStacked.append("text")
        .attr("class", "AgeRace")
          .attr("y", 220)
          .attr("x", 600)
          .attr("font-family", "calibri")
          .attr("font-size", 30)
          .style("fill", "yellow")
          .text("Yellow - ages 60 - 69");
        svgStacked.append("text")
        .attr("class", "AgeRace")
          .attr("y", 250)
          .attr("x", 600)
          .attr("font-family", "calibri")
          .attr("font-size", 30)
          .style("fill", "black")
          .text("Gray - ages  > 70");


        // drawing the individual bars
        // white
        svgStacked.selectAll(".bar")
          .data(copyOfRaceAge)
          .enter()
          .append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceAge[0][1][0] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceAge[0][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceAge[0][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceAge[0][1][0]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "blue");
        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceAge[0][1][1] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceAge[0][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceAge[0][1][1] + copyOfRaceAge[0][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceAge[0][1][1]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "tomato");
        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceAge[0][1][2] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceAge[0][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceAge[0][1][2] + copyOfRaceAge[0][1][1] + copyOfRaceAge[0][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceAge[0][1][2]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "green");
        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceAge[0][1][3] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceAge[0][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceAge[0][1][3] + copyOfRaceAge[0][1][2] + copyOfRaceAge[0][1][1] + copyOfRaceAge[0][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceAge[0][1][3]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "steelblue");
        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceAge[0][1][4] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceAge[0][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceAge[0][1][4] + copyOfRaceAge[0][1][3] + copyOfRaceAge[0][1][2] + copyOfRaceAge[0][1][1] + copyOfRaceAge[0][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceAge[0][1][4]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "yellow");
        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceAge[0][1][5] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceAge[0][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceAge[0][1][5] + copyOfRaceAge[0][1][4] + copyOfRaceAge[0][1][3] + copyOfRaceAge[0][1][2] + copyOfRaceAge[0][1][1] + copyOfRaceAge[0][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceAge[0][1][5]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "gray");
        // latino
        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceAge[1][1][0] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceAge[1][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceAge[1][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceAge[1][1][0]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "blue");
        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceAge[1][1][1] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceAge[1][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceAge[1][1][1] + copyOfRaceAge[1][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceAge[1][1][1]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "tomato");
        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceAge[1][1][2] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceAge[1][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceAge[1][1][2] + copyOfRaceAge[1][1][1] + copyOfRaceAge[1][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceAge[1][1][2]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "green");
        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceAge[1][1][3] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceAge[1][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceAge[1][1][3] + copyOfRaceAge[1][1][2] + copyOfRaceAge[1][1][1] + copyOfRaceAge[1][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceAge[1][1][3]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "steelblue");
        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceAge[1][1][4] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceAge[1][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceAge[1][1][4] + copyOfRaceAge[1][1][3] + copyOfRaceAge[1][1][2] + copyOfRaceAge[1][1][1] + copyOfRaceAge[1][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceAge[1][1][4]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "yellow");
        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceAge[1][1][5] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceAge[1][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceAge[1][1][5] + copyOfRaceAge[1][1][4] + copyOfRaceAge[1][1][3] + copyOfRaceAge[1][1][2] + copyOfRaceAge[1][1][1] + copyOfRaceAge[1][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceAge[1][1][5]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "gray");
        // black
        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceAge[2][1][0] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceAge[2][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceAge[2][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceAge[2][1][0]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "blue");
        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceAge[2][1][1] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceAge[2][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceAge[2][1][1] + copyOfRaceAge[2][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceAge[2][1][1]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "tomato");
        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceAge[2][1][2] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceAge[2][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceAge[2][1][2] + copyOfRaceAge[2][1][1] + copyOfRaceAge[2][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceAge[2][1][2]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "green");
        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceAge[2][1][3] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceAge[2][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceAge[2][1][3] + copyOfRaceAge[2][1][2] + copyOfRaceAge[2][1][1] + copyOfRaceAge[2][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceAge[2][1][3]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "steelblue");
        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceAge[2][1][4] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceAge[2][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceAge[2][1][4] + copyOfRaceAge[2][1][3] + copyOfRaceAge[2][1][2] + copyOfRaceAge[2][1][1] + copyOfRaceAge[2][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceAge[2][1][4]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "yellow");
        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceAge[2][1][5] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceAge[2][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceAge[2][1][5] + copyOfRaceAge[2][1][4] + copyOfRaceAge[2][1][3] + copyOfRaceAge[2][1][2] + copyOfRaceAge[2][1][1] + copyOfRaceAge[2][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceAge[2][1][5]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "gray");
        //native american
        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceAge[3][1][0] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceAge[3][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceAge[3][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceAge[3][1][0]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "blue");
        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceAge[3][1][1] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceAge[3][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceAge[3][1][1] + copyOfRaceAge[3][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceAge[3][1][1]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "tomato");
        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceAge[3][1][2] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceAge[3][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceAge[3][1][2] + copyOfRaceAge[3][1][1] + copyOfRaceAge[3][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceAge[3][1][2]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "green");
        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceAge[3][1][3] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceAge[3][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceAge[3][1][3] + copyOfRaceAge[3][1][2] + copyOfRaceAge[3][1][1] + copyOfRaceAge[3][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceAge[3][1][3]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "steelblue");
        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceAge[3][1][4] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceAge[3][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceAge[3][1][4] + copyOfRaceAge[3][1][3] + copyOfRaceAge[3][1][2] + copyOfRaceAge[3][1][1] + copyOfRaceAge[3][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceAge[3][1][4]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "yellow");
        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceAge[3][1][5] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceAge[3][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceAge[3][1][5] + copyOfRaceAge[3][1][4] + copyOfRaceAge[3][1][3] + copyOfRaceAge[3][1][2] + copyOfRaceAge[3][1][1] + copyOfRaceAge[3][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceAge[3][1][5]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "gray");
        //Asian Not all ages represented
        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceAge[4][1][0] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceAge[4][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceAge[4][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceAge[4][1][0]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "blue");
        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceAge[4][1][1] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceAge[4][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceAge[4][1][1] + copyOfRaceAge[4][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceAge[4][1][1]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "tomato");
        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceAge[4][1][2] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceAge[4][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceAge[4][1][2] + copyOfRaceAge[4][1][1] + copyOfRaceAge[4][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceAge[4][1][2]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "green");
          // other not all ages are represented
        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceAge[5][1][1] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceAge[5][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceAge[5][1][1] + copyOfRaceAge[5][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceAge[5][1][1]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "tomato");
        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceAge[5][1][3] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceAge[5][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceAge[5][1][3] + copyOfRaceAge[5][1][2] + copyOfRaceAge[5][1][1] + copyOfRaceAge[5][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceAge[5][1][3]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "steelblue");        
  // end of xAgeRace   
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

        console.log(copyOfRaceState)
        console.log(states)

        xScatter = d3.scaleBand().rangeRound([0, widthScatter]).padding(0.5);
        xScatter.domain(states);

        yScatter = d3.scaleLinear().rangeRound([heightScatter, 0]);
        yScatter.domain([0, 550]);

        xAxisScatter = d3.axisBottom()
          .scale(xScatter);

        yAxisScatter = d3.axisLeft()
          .scale(yScatter);

        // x - axis
        svgStacked.append("g")
          .attr("class", "xAxis")
          .attr("transform", "translate(0," + heightScatter + ")")
          .style("font-size", 16)
          .call(xAxisScatter);

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
          .call(yAxisScatter);

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
          .attr("height", "20%")
          .attr("width", "30%")
          .attr("fill", "gray");
        svgStacked.append("text")
        .attr("class", "RaceState")
          .attr("y", 100)
          .attr("font-family", "calibri")
          .attr("font-size", 30)
          .attr("x", 260)
          .style("fill", "blue")
          .text("Blue - Race, White");
        svgStacked.append("text")
        .attr("class", "RaceState")
          .attr("font-family", "calibri")
          .attr("font-size", 30)
          .attr("y", 130)
          .attr("x", 260)
          .style("fill", "tomato")
          .text("Red - Race, Latino");
        svgStacked.append("text")
        .attr("class", "RaceState")
          .attr("y", 160)
          .attr("x", 260)
          .attr("font-family", "calibri")
          .attr("font-size", 30)
          .style("fill", "green")
          .text("Green - Race, Black");

        svgStacked.selectAll(".bar")
          .data(copyOfRaceState)
          .enter()
          .append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[0][1][0] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[0][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[0][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[0][1][0]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "blue");
        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[0][1][2] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[0][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[0][1][2] + copyOfRaceState[0][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[0][1][2]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "green");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[1][1][0] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[1][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[1][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[1][1][0]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "blue");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[1][1][1] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[1][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[1][1][1] + copyOfRaceState[1][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[1][1][1]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "tomato");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[1][1][2] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[1][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[1][1][2] + copyOfRaceState[1][1][1] + copyOfRaceState[1][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[1][1][2]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "green");

          svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[2][1][0] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[2][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[2][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[2][1][0]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "blue");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[2][1][1] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[2][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[2][1][1] + copyOfRaceState[2][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[2][1][1]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "tomato");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[2][1][2] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[2][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[2][1][2] + copyOfRaceState[2][1][1] + copyOfRaceState[2][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[2][1][2]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "green");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[3][1][0] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[3][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[3][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[3][1][0]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "blue");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[3][1][1] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[3][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[3][1][1] + copyOfRaceState[3][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[3][1][1]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "tomato");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[3][1][2] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[3][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[3][1][2] + copyOfRaceState[3][1][1] + copyOfRaceState[3][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[3][1][2]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "green");
        
          // start here
        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[4][1][0] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[4][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[4][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[4][1][0]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "blue");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[4][1][1] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[4][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[4][1][1] + copyOfRaceState[4][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[4][1][1]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "tomato");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[4][1][2] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[4][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[4][1][2] + copyOfRaceState[4][1][1] + copyOfRaceState[4][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[4][1][2]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "green");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[5][1][0] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[5][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[5][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[5][1][0]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "blue");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[5][1][1] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[5][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[5][1][1] + copyOfRaceState[5][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[5][1][1]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "tomato");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[5][1][2] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[5][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[5][1][2] + copyOfRaceState[5][1][1] + copyOfRaceState[5][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[5][1][2]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "green");
        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[6][1][0] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[6][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[6][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[6][1][0]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "blue");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[6][1][1] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[6][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[6][1][1] + copyOfRaceState[6][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[6][1][1]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "tomato");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[6][1][2] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[6][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[6][1][2] + copyOfRaceState[6][1][1] + copyOfRaceState[6][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[6][1][2]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "green");
        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[7][1][0] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[7][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[7][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[7][1][0]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "blue");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[7][1][1] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[7][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[7][1][1] + copyOfRaceState[7][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[7][1][1]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "tomato");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[7][1][2] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[7][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[7][1][2] + copyOfRaceState[7][1][1] + copyOfRaceState[7][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[7][1][2]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "green");
        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[8][1][0] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[8][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[8][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[8][1][0]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "blue");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[8][1][1] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[8][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[8][1][1] + copyOfRaceState[8][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[8][1][1]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "tomato");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[8][1][2] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[8][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[8][1][2] + copyOfRaceState[8][1][1] + copyOfRaceState[8][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[8][1][2]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "green");
        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[9][1][0] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[9][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[9][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[9][1][0]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "blue");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[9][1][1] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[9][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[9][1][1] + copyOfRaceState[9][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[9][1][1]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "tomato");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[9][1][2] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[9][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[9][1][2] + copyOfRaceState[9][1][1] + copyOfRaceState[9][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[9][1][2]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "green");
        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[10][1][0] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[10][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[10][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[10][1][0]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "blue");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[10][1][1] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[10][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[10][1][1] + copyOfRaceState[10][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[10][1][1]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "tomato");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[10][1][2] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[10][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[10][1][2] + copyOfRaceState[10][1][1] + copyOfRaceState[10][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[10][1][2]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "green");
        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[11][1][0] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[11][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[11][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[11][1][0]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "blue");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[11][1][1] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[11][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[11][1][1] + copyOfRaceState[11][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[11][1][1]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "tomato");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[11][1][2] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[11][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[11][1][2] + copyOfRaceState[11][1][1] + copyOfRaceState[11][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[11][1][2]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "green");
        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[12][1][0] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[12][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[12][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[12][1][0]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "blue");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[12][1][1] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[12][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[12][1][1] + copyOfRaceState[12][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[12][1][1]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "tomato");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[12][1][2] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[12][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[12][1][2] + copyOfRaceState[12][1][1] + copyOfRaceState[12][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[12][1][2]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "green");
        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[13][1][0] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[13][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[13][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[13][1][0]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "blue");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[13][1][1] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[13][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[13][1][1] + copyOfRaceState[13][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[13][1][1]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "tomato");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[13][1][2] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[13][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[13][1][2] + copyOfRaceState[13][1][1] + copyOfRaceState[13][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[13][1][2]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "green");
        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[14][1][0] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[14][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[14][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[14][1][0]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "blue");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[14][1][1] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[14][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[14][1][1] + copyOfRaceState[14][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[14][1][1]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "tomato");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[14][1][2] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[14][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[14][1][2] + copyOfRaceState[14][1][1] + copyOfRaceState[14][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[14][1][2]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "green");
        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[15][1][0] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[15][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[15][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[15][1][0]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "blue");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[15][1][1] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[15][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[15][1][1] + copyOfRaceState[15][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[15][1][1]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "tomato");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[15][1][2] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[15][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[15][1][2] + copyOfRaceState[15][1][1] + copyOfRaceState[15][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[15][1][2]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "green");
        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[16][1][0] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[16][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[16][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[16][1][0]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "blue");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[16][1][1] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[16][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[16][1][1] + copyOfRaceState[16][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[16][1][1]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "tomato");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[16][1][2] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[16][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[16][1][2] + copyOfRaceState[16][1][1] + copyOfRaceState[16][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[16][1][2]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "green");
        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[17][1][0] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[17][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[17][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[17][1][0]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "blue");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[17][1][1] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[17][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[17][1][1] + copyOfRaceState[17][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[17][1][1]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "tomato");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[17][1][2] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[17][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[17][1][2] + copyOfRaceState[17][1][1] + copyOfRaceState[17][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[17][1][2]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "green");
        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[18][1][0] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[18][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[18][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[18][1][0]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "blue");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[18][1][1] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[18][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[18][1][1] + copyOfRaceState[18][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[18][1][1]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "tomato");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[18][1][2] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[18][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[18][1][2] + copyOfRaceState[18][1][1] + copyOfRaceState[18][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[18][1][2]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "green");
        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[19][1][0] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[19][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[19][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[19][1][0]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "blue");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[19][1][1] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[19][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[19][1][1] + copyOfRaceState[19][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[19][1][1]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "tomato");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[19][1][2] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[19][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[19][1][2] + copyOfRaceState[19][1][1] + copyOfRaceState[19][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[19][1][2]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "green");
        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[20][1][0] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[20][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[20][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[20][1][0]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "blue");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[20][1][1] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[20][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[20][1][1] + copyOfRaceState[20][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[20][1][1]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "tomato");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[20][1][2] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[20][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[20][1][2] + copyOfRaceState[20][1][1] + copyOfRaceState[20][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[20][1][2]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "green");
        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[21][1][0] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[21][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[21][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[21][1][0]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "blue");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[21][1][1] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[21][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[21][1][1] + copyOfRaceState[21][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[21][1][1]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "tomato");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[21][1][2] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[21][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[21][1][2] + copyOfRaceState[21][1][1] + copyOfRaceState[21][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[21][1][2]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "green");
        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[22][1][0] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[22][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[22][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[22][1][0]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "blue");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[22][1][1] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[22][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[22][1][1] + copyOfRaceState[22][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[22][1][1]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "tomato");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[22][1][2] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[22][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[3][1][2] + copyOfRaceState[22][1][1] + copyOfRaceState[22][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[22][1][2]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "green");
        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[23][1][0] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[23][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[23][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[23][1][0]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "blue");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[23][1][1] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[23][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[23][1][1] + copyOfRaceState[23][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[23][1][1]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "tomato");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[23][1][2] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[23][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[23][1][2] + copyOfRaceState[23][1][1] + copyOfRaceState[23][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[23][1][2]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "green");
        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[24][1][0] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[24][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[24][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[24][1][0]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "blue");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[24][1][1] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[24][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[24][1][1] + copyOfRaceState[24][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[24][1][1]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "tomato");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[24][1][2] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[24][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[3][1][2] + copyOfRaceState[24][1][1] + copyOfRaceState[24][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[24][1][2]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "green");
        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[24][1][0] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[24][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[24][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[24][1][0]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "blue");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[24][1][1] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[24][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[24][1][1] + copyOfRaceState[24][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[24][1][1]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "tomato");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[24][1][2] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[24][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[24][1][2] + copyOfRaceState[24][1][1] + copyOfRaceState[24][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[24][1][2]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "green");
        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[25][1][0] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[25][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[25][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[25][1][0]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "blue");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[25][1][1] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[25][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[25][1][1] + copyOfRaceState[25][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[25][1][1]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "tomato");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[25][1][2] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[25][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[25][1][2] + copyOfRaceState[25][1][1] + copyOfRaceState[25][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[25][1][2]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "green");
        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[26][1][0] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[26][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[26][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[26][1][0]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "blue");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[26][1][1] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[26][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[26][1][1] + copyOfRaceState[26][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[26][1][1]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "tomato");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[26][1][2] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[26][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[26][1][2] + copyOfRaceState[26][1][1] + copyOfRaceState[26][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[26][1][2]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "green");
        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[27][1][0] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[27][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[27][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[27][1][0]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "blue");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[27][1][1] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[27][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[27][1][1] + copyOfRaceState[27][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[27][1][1]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "tomato");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[27][1][2] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[27][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[3][1][2] + copyOfRaceState[27][1][1] + copyOfRaceState[27][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[27][1][2]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "green");
        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[28][1][0] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[28][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[28][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[28][1][0]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "blue");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[28][1][1] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[28][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[28][1][1] + copyOfRaceState[28][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[28][1][1]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "tomato");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[28][1][2] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[28][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[28][1][2] + copyOfRaceState[28][1][1] + copyOfRaceState[28][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[28][1][2]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "green");
        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[29][1][0] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[29][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[29][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[29][1][0]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "blue");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[29][1][1] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[29][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[29][1][1] + copyOfRaceState[29][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[29][1][1]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "tomato");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[29][1][2] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[29][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[29][1][2] + copyOfRaceState[29][1][1] + copyOfRaceState[29][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[29][1][2]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "green");
        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[30][1][0] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[30][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[30][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[30][1][0]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "blue");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[30][1][1] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[30][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[30][1][1] + copyOfRaceState[30][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[30][1][1]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "tomato");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[30][1][2] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[30][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[30][1][2] + copyOfRaceState[30][1][1] + copyOfRaceState[30][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[30][1][2]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "green");
        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[31][1][0] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[31][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[31][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[31][1][0]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "blue");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[31][1][1] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[3][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[31][1][1] + copyOfRaceState[31][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[31][1][1]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "tomato");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[31][1][2] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[31][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[3][1][2] + copyOfRaceState[31][1][1] + copyOfRaceState[31][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[31][1][2]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "green");
        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[32][1][0] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[32][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[32][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[32][1][0]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "blue");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[32][1][1] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[32][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[32][1][1] + copyOfRaceState[32][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[32][1][1]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "tomato");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[32][1][2] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[32][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[3][1][2] + copyOfRaceState[32][1][1] + copyOfRaceState[32][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[32][1][2]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "green");
        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[33][1][0] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[33][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[33][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[33][1][0]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "blue");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[33][1][1] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[33][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[33][1][1] + copyOfRaceState[33][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[33][1][1]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "tomato");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[33][1][2] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[33][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[3][1][2] + copyOfRaceState[33][1][1] + copyOfRaceState[33][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[33][1][2]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "green");
        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[34][1][0] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[34][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[34][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[34][1][0]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "blue");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[34][1][1] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[34][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[34][1][1] + copyOfRaceState[34][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[34][1][1]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "tomato");

        svgStacked.append("rect")
          .on("mouseover", function(d) {   
            labelScatter.style("opacity", 1); 
            labelScatter.html("" + copyOfRaceState[34][1][2] + "");
            labelScatter.style("visibility", "visible")
               .style("left", (d3.event.pageX - 30) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
          .on("mouseout", function() { labelScatter.style("visibility", "hidden");})
          .transition()
          .duration(2000)
          .attr("class", "bar")
          .attr("x", xScatter(copyOfRaceState[34][0]))
          .attr("y", function(d) { return yScatter(copyOfRaceState[34][1][2] + copyOfRaceState[34][1][1] + copyOfRaceState[34][1][0]); } )
          .attr("height", function(d) { return heightScatter - yScatter(copyOfRaceState[34][1][2]); })
          .attr("width", xScatter.bandwidth())
          .attr("fill", "green");
  // end of xRaceState  
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

        for (j = 0; j < raceData.length; j++) {  
          for (i = 0; i < raceData[j].values.length; i++) {
              if (j == 0) {
                // White race Age
                if (tt.includes(Number(raceData[0].values[i].Age))) {
                  white2030.push(raceData[0].values[i]);
                }
                if (tf.includes(Number(raceData[0].values[i].Age))) {
                  white3040.push(raceData[0].values[i]);
                }
                if (ff.includes(Number(raceData[0].values[i].Age))) {
                  white4050.push(raceData[0].values[i]);
                }
                if (fs.includes(Number(raceData[0].values[i].Age))) {
                  white5060.push(raceData[0].values[i]);
                }
                if (ss.includes(Number(raceData[0].values[i].Age))) {
                  white6070.push(raceData[0].values[i]); 
                }
                if (se.includes(Number(raceData[0].values[i].Age))) {
                  white7080.push(raceData[0].values[i]); 
                }
              }
              if (j == 1) {
                if (tt.includes(Number(raceData[1].values[i].Age))) {
                  latino2030.push(raceData[1].values[i]);
                }
                if (tf.includes(Number(raceData[1].values[i].Age))) {
                  latino3040.push(raceData[1].values[i]);
                }
                if (ff.includes(Number(raceData[1].values[i].Age))) {
                  latino4050.push(raceData[1].values[i]);
                }
                if (fs.includes(Number(raceData[1].values[i].Age))) {
                  latino5060.push(raceData[1].values[i]);
                }
                if (ss.includes(Number(raceData[1].values[i].Age))) {
                  latino6070.push(raceData[1].values[i]); 
                }
                if (se.includes(Number(raceData[1].values[i].Age))) {
                  latino7080.push(raceData[1].values[i]); 
                }
              }
              if (j == 2) {
                if (tt.includes(Number(raceData[2].values[i].Age))) {
                  black2030.push(raceData[2].values[i]);
                }
                if (tf.includes(Number(raceData[2].values[i].Age))) {
                  black3040.push(raceData[2].values[i]);
                }
                if (ff.includes(Number(raceData[2].values[i].Age))) {
                  black4050.push(raceData[2].values[i]);
                }
                if (fs.includes(Number(raceData[2].values[i].Age))) {
                  black5060.push(raceData[2].values[i]);
                }
                if (ss.includes(Number(raceData[2].values[i].Age))) {
                  black6070.push(raceData[2].values[i]); 
                }
                if (se.includes(Number(raceData[2].values[i].Age))) {
                  black7080.push(raceData[2].values[i]); 
                }
              }
              if (j == 3) {
                if (tt.includes(Number(raceData[3].values[i].Age))) {
                  american2030.push(raceData[3].values[i]);
                }
                if (tf.includes(Number(raceData[3].values[i].Age))) {
                  american3040.push(raceData[3].values[i]);
                }
                if (ff.includes(Number(raceData[3].values[i].Age))) {
                  american4050.push(raceData[3].values[i]);
                }
                if (fs.includes(Number(raceData[3].values[i].Age))) {
                  american5060.push(raceData[3].values[i]);
                }
                if (ss.includes(Number(raceData[3].values[i].Age))) {
                  american6070.push(raceData[3].values[i]); 
                }
                if (se.includes(Number(raceData[3].values[i].Age))) {
                  american7080.push(raceData[3].values[i]); 
                }
              }
              if (j == 4) {
                if (tt.includes(Number(raceData[4].values[i].Age))) {
                  asian2030.push(raceData[4].values[i]);
                }
                if (tf.includes(Number(raceData[4].values[i].Age))) {
                  asian3040.push(raceData[4].values[i]);
                }
                if (ff.includes(Number(raceData[4].values[i].Age))) {
                  asian4050.push(raceData[4].values[i]);
                }
                if (fs.includes(Number(raceData[4].values[i].Age))) {
                  asian5060.push(raceData[4].values[i]);
                }
                if (ss.includes(Number(raceData[4].values[i].Age))) {
                  asian6070.push(raceData[4].values[i]); 
                }
                if (se.includes(Number(raceData[4].values[i].Age))) {
                  asian7080.push(raceData[4].values[i]); 
                }
              }
              if (j == 5) {
                if (tt.includes(Number(raceData[5].values[i].Age))) {
                  other2030.push(raceData[5].values[i]);
                }
                if (tf.includes(Number(raceData[5].values[i].Age))) {
                  other3040.push(raceData[5].values[i]);
                }
                if (ff.includes(Number(raceData[5].values[i].Age))) {
                  other4050.push(raceData[5].values[i]);
                }
                if (fs.includes(Number(raceData[5].values[i].Age))) {
                  other5060.push(raceData[5].values[i]);
                }
                if (ss.includes(Number(raceData[5].values[i].Age))) {
                  other6070.push(raceData[5].values[i]); 
                }
                if (se.includes(Number(raceData[5].values[i].Age))) {
                  other7080.push(raceData[5].values[i]); 
                } 
              }
          }
        }

        // state Race
        console.log(stateData)
        for (j = 0; j < stateData.length; j++) {  
          for (i = 0; i < stateData[j].values.length; i++) {
            if (j == 0) {
              if (stateData[j].values[i].Race == "White") {
                  whiteSC.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Latino") {
                  latinoSC.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Black") {
                  blackSC.push(stateData[j].values[i]);
              }
            }
            if (j == 1) {
              if (stateData[j].values[i].Race == "White") {
                  whiteAR.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Latino") {
                  latinoAR.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Black") {
                  blackAR.push(stateData[j].values[i]);
              }
            }
            if (j == 2) {
              if (stateData[j].values[i].Race == "White") {
                  whiteID.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Latino") {
                  latinoID.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Black") {
                  blackID.push(stateData[j].values[i]);
              }
            }
            if (j == 3) {
              if (stateData[j].values[i].Race == "White") {
                  whiteVA.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Latino") {
                  latinoVA.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Black") {
                  blackVA.push(stateData[j].values[i]);
              }
            }
            if (j == 4) {
              if (stateData[j].values[i].Race == "White") {
                  whiteTX.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Latino") {
                  latinoTX.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Black") {
                  blackTX.push(stateData[j].values[i]);
              }
            }
            if (j == 5) {
              if (stateData[j].values[i].Race == "White") {
                  whiteWA.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Latino") {
                  latinoWA.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Black") {
                  blackWA.push(stateData[j].values[i]);
              }
            }
            if (j == 6) {
              if (stateData[j].values[i].Race == "White") {
                  whiteLA.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Latino") {
                  latinoLA.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Black") {
                  blackLA.push(stateData[j].values[i]);
              }
            }
            if (j == 7) {
              if (stateData[j].values[i].Race == "White") {
                  whiteMO.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Latino") {
                  latinoMO.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Black") {
                  blackMO.push(stateData[j].values[i]);
              }
            }
            if (j == 8) {
              if (stateData[j].values[i].Race == "White") {
                  whiteOK.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Latino") {
                  latinoOK.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Black") {
                  blackOK.push(stateData[j].values[i]);
              }
            }
            if (j == 9) {
              if (stateData[j].values[i].Race == "White") {
                  whiteGA.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Latino") {
                  latinoGA.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Black") {
                  blackGA.push(stateData[j].values[i]);
              }
            }
            if (j == 10) {
              if (stateData[j].values[i].Race == "White") {
                  whiteAL.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Latino") {
                  latinoAL.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Black") {
                  blackAL.push(stateData[j].values[i]);
              }
            }
            if (j == 11) {
              if (stateData[j].values[i].Race == "White") {
                  whiteFL.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Latino") {
                  latinoFL.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Black") {
                  blackFL.push(stateData[j].values[i]);
              }
            }
            if (j == 12) {
              if (stateData[j].values[i].Race == "White") {
                  whiteCA.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Latino") {
                  latinoCA.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Black") {
                  blackCA.push(stateData[j].values[i]);
              }
            }
            if (j == 13) {
              if (stateData[j].values[i].Race == "White") {
                  whiteAZ.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Latino") {
                  latinoAZ.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Black") {
                  blackAZ.push(stateData[j].values[i]);
              }
            }
            if (j == 14) {
              if (stateData[j].values[i].Race == "White") {
                  whiteOH.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Latino") {
                  latinoOH.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Black") {
                  blackOH.push(stateData[j].values[i]);
              }
            }
            if (j == 15) {
              if (stateData[j].values[i].Race == "White") {
                  whiteIN.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Latino") {
                  latinoIN.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Black") {
                  blackIN.push(stateData[j].values[i]);
              }
            }
            if (j == 16) {
              if (stateData[j].values[i].Race == "White") {
                  whiteNC.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Latino") {
                  latinoNC.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Black") {
                  blackNC.push(stateData[j].values[i]);
              }
            }
            if (j == 17) {
              if (stateData[j].values[i].Race == "White") {
                  whiteDE.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Latino") {
                  latinoDE.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Black") {
                  blackDE.push(stateData[j].values[i]);
              }
            }
            if (j == 18) {
              if (stateData[j].values[i].Race == "White") {
                  whiteNV.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Latino") {
                  latinoNV.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Black") {
                  blackNV.push(stateData[j].values[i]);
              }
            }
            if (j == 19) {
              if (stateData[j].values[i].Race == "White") {
                  whiteIL.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Latino") {
                  latinoIL.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Black") {
                  blackIL.push(stateData[j].values[i]);
              }
            }
            if (j == 20) {
              if (stateData[j].values[i].Race == "White") {
                  whitePA.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Latino") {
                  latinoPA.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Black") {
                  blackPA.push(stateData[j].values[i]);
              }
            }
            if (j == 21) {
              if (stateData[j].values[i].Race == "White") {
                  whiteMT.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Latino") {
                  latinoMT.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Black") {
                  blackMT.push(stateData[j].values[i]);
              }
            }
            if (j == 22) {
              if (stateData[j].values[i].Race == "White") {
                  whiteFE.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Latino") {
                  latinoFE.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Black") {
                  blackFE.push(stateData[j].values[i]);
              }
            }
            if (j == 23) {
              if (stateData[j].values[i].Race == "White") {
                  whiteUT.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Latino") {
                  latinoUT.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Black") {
                  blackUT.push(stateData[j].values[i]);
              }
            }
            if (j == 24) {
              if (stateData[j].values[i].Race == "White") {
                  whiteMS.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Latino") {
                  latinoMS.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Black") {
                  blackMS.push(stateData[j].values[i]);
              }
            }
            if (j == 25) {
              if (stateData[j].values[i].Race == "White") {
                  whiteKY.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Latino") {
                  latinoKY.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Black") {
                  blackKY.push(stateData[j].values[i]);
              }
            }
            if (j == 26) {
              if (stateData[j].values[i].Race == "White") {
                  whiteMD.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Latino") {
                  latinoMD.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Black") {
                  blackMD.push(stateData[j].values[i]);
              }
            }
            if (j == 27) {
              if (stateData[j].values[i].Race == "White") {
                  whiteOR.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Latino") {
                  latinoOR.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Black") {
                  blackOR.push(stateData[j].values[i]);
              }
            }
            if (j == 28) {
              if (stateData[j].values[i].Race == "White") {
                  whiteNE.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Latino") {
                  latinoNE.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Black") {
                  blackNE.push(stateData[j].values[i]);
              }
            }
            if (j == 29) {
              if (stateData[j].values[i].Race == "White") {
                  whiteWY.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Latino") {
                  latinoWY.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Black") {
                  blackWY.push(stateData[j].values[i]);
              }
            }
            if (j == 30) {
              if (stateData[j].values[i].Race == "White") {
                  whiteCO.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Latino") {
                  latinoCO.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Black") {
                  blackCO.push(stateData[j].values[i]);
              }
            }
            if (j == 31) {
              if (stateData[j].values[i].Race == "White") {
                  whiteNM.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Latino") {
                  latinoNM.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Black") {
                  blackNM.push(stateData[j].values[i]);
              }
            }
            if (j == 32) {
              if (stateData[j].values[i].Race == "White") {
                  whiteTN.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Latino") {
                  latinoTN.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Black") {
                  blackTN.push(stateData[j].values[i]);
              }
            }
            if (j == 33) {
              if (stateData[j].values[i].Race == "White") {
                  whiteCT.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Latino") {
                  latinoCT.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Black") {
                  blackCT.push(stateData[j].values[i]);
              }
            }
            if (j == 34) {
              if (stateData[j].values[i].Race == "White") {
                  whiteSD.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Latino") {
                  latinoSD.push(stateData[j].values[i]);
              }
              if (stateData[j].values[i].Race == "Black") {
                  blackSD.push(stateData[j].values[i]);
              }
            }
          }
        }

        var raceAgeData = [
              [white2030.length, white3040.length, white4050.length, white5060.length, white6070.length, white7080.length],
              [latino2030.length, latino3040.length, latino4050.length, latino5060.length, latino6070.length, latino7080.length],
              [black2030.length, black3040.length, black4050.length, black5060.length, black6070.length, black7080.length],
              [american2030.length, american3040.length, american4050.length, american5060.length, american6070.length, american7080.length],
              [asian2030.length, asian3040.length ,asian4050.length ,asian5060.length ,asian6070.length ,asian7080.length],
              [other2030.length, other3040.length ,other4050.length ,other5060.length ,other6070.length ,other7080.length]          
              ];

        var raceStateData = [
              [whiteAL.length,latinoAL.length,blackAL.length],
              [whiteAR.length,latinoAR.length,blackAR.length],
              [whiteAZ.length,latinoAZ.length,blackAZ.length],
              [whiteCA.length,latinoCA.length,blackCA.length],
              [whiteCO.length,latinoCO.length,blackCO.length],
              [whiteCT.length,latinoCT.length,blackCT.length],
              [whiteDE.length,latinoDE.length,blackDE.length],
              [whiteFE.length,latinoFE.length,blackFE.length],
              [whiteFL.length,latinoFL.length,blackFL.length],
              [whiteGA.length,latinoGA.length,blackGA.length],
              [whiteID.length,latinoID.length,blackID.length],
              [whiteIL.length,latinoIL.length,blackIL.length],
              [whiteIN.length,latinoIN.length,blackIN.length],
              [whiteKY.length,latinoKY.length,blackKY.length],
              [whiteLA.length,latinoLA.length,blackLA.length],
              [whiteMD.length,latinoMD.length,blackMD.length],
              [whiteMO.length,latinoMO.length,blackMO.length],
              [whiteMS.length,latinoMS.length,blackMS.length],
              [whiteMT.length,latinoMT.length,blackMT.length],
              [whiteNC.length,latinoNC.length,blackNC.length],
              [whiteNE.length,latinoNE.length,blackNE.length],
              [whiteNM.length,latinoNM.length,blackNM.length],
              [whiteNV.length,latinoNV.length,blackNV.length],
              [whiteOH.length,latinoOH.length,blackOH.length],
              [whiteOK.length,latinoOK.length,blackOK.length],
              [whiteOR.length,latinoOR.length,blackOR.length],
              [whitePA.length,latinoPA.length,blackPA.length],
              [whiteSC.length,latinoSC.length,blackSC.length],
              [whiteSD.length,latinoSD.length,blackSD.length],
              [whiteTN.length,latinoTN.length,blackTN.length],
              [whiteTX.length,latinoTX.length,blackTX.length],
              [whiteUT.length,latinoUT.length,blackUT.length],
              [whiteVA.length,latinoVA.length,blackVA.length],
              [whiteWA.length,latinoWA.length,blackWA.length],
              [whiteWY.length,latinoWY.length,blackWY.length]
            ];  
            
        // place data in a neat way when drawing the bar chart.
        var raceAgePlot = [];
        var raceStatePlot = [];
            
        for (i = 0; i < raceAgeData.length; i++) {
            raceAgePlot[i] = [races[i], raceAgeData[i]];
        }
        
        for (i = 0; i < raceStateData.length; i++) {
            raceStatePlot[i] = [states[i], raceStateData[i]];
        }

        copyOfRaceAge = raceAgePlot;
        copyOfRaceState = raceStatePlot;
        console.log("makeData finished")
  } //makeData() ends here

  // as the name implies.
  // We need to reset in order not to add extra data for histogram heights
  function resetVariables() {
        copyOfRaceAge = null;
        copyOfRaceState = null;
        // Race Age variables
        white2030 = [];
        white3040 = [];
        white4050 = [];
        white5060 = [];
        white6070 = [];
        white7080 = [];
        latino2030 = [];
        latino3040 = [];
        latino4050 = [];
        latino5060 = [];
        latino6070 = [];
        latino7080 = [];
        american2030 = [];
        american3040 = [];
        american4050 = [];
        american5060 = [];
        american6070 = [];
        american7080 = [];        
        asian2030 = [];
        asian3040 = [];
        asian4050 = [];
        asian5060 = [];
        asian6070 = [];
        asian7080 = [];
        black2030 = [];
        black3040 = [];
        black4050 = [];
        black5060 = [];
        black6070 = [];
        black7080 = [];
        other2030 = [];
        other3040 = [];
        other4050 = [];
        other5060 = [];
        other6070 = [];
        other7080 = [];

        //Race State variables
        whiteAL = [];
        whiteAR = [];
        whiteAZ = [];
        whiteCA = [];
        whiteCO = [];
        whiteCT = [];
        whiteDE = [];
        whiteFE = [];
        whiteFL = [];
        whiteGA = [];
        whiteID = [];
        whiteIL = [];
        whiteIN = [];
        whiteKY = [];
        whiteLA = [];
        whiteMD = [];
        whiteMO = [];
        whiteMS = [];
        whiteMT = [];
        whiteNC = [];
        whiteNE = [];
        whiteNM = [];
        whiteNV = [];
        whiteOH = [];
        whiteOK = [];
        whiteOR = [];
        whitePA = [];
        whiteSC = [];
        whiteSD = [];
        whiteTN = [];
        whiteTX = [];
        whiteUT = [];
        whiteVA = [];
        whiteWA = [];
        whiteWY = [];
        latinoAL = [];
        latinoAR = [];
        latinoAZ = [];
        latinoCA = [];
        latinoCO = [];
        latinoCT = [];
        latinoDE = [];
        latinoFE = [];
        latinoFL = [];
        latinoGA = [];
        latinoID = [];
        latinoIL = [];
        latinoIN = [];
        latinoKY = [];
        latinoLA = [];
        latinoMD = [];
        latinoMO = [];
        latinoMS = [];
        latinoMT = [];
        latinoNC = [];
        latinoNE = [];
        latinoNM = [];
        latinoNV = [];
        latinoOH = [];
        latinoOK = [];
        latinoOR = [];
        latinoPA = [];
        latinoSC = [];
        latinoSD = [];
        latinoTN = [];
        latinoTX = [];
        latinoUT = [];
        latinoVA = [];
        latinoWA = [];
        latinoWY = [];
        blackAL = [];
        blackAR = [];
        blackAZ = [];
        blackCA = [];
        blackCO = [];
        blackCT = [];
        blackDE = [];
        blackFE = [];
        blackFL = [];
        blackGA = [];
        blackID = [];
        blackIL = [];
        blackIN = [];
        blackKY = [];
        blackLA = [];
        blackMD = [];
        blackMO = [];
        blackMS = [];
        blackMT = [];
        blackNC = [];
        blackNE = [];
        blackNM = [];
        blackNV = [];
        blackOH = [];
        blackOK = [];
        blackOR = [];
        blackPA = [];
        blackSC = [];
        blackSD = [];
        blackTN = [];
        blackTX = [];
        blackUT = [];
        blackVA = [];
        blackWA = [];
        blackWY = [];
  } // resetVariables() end here

} // init function end
   

 
 

