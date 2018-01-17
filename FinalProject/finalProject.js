d3.select(window).on('load', init);

var copyOfData = null;

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

  var svgScatter = d3.select("#svgScatter")
      .attr("width", widthScatter + margin.left + margin.right)
      .attr("height", heightScatter + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .attr("padding", 10);
  
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
        .attr("class", "bar")
        .attr("x", function(d) { return xHist(d[0]); })
        .attr("y", function(d) { return yHist(d[1]); })
        .attr("height", function(d) { return height - yHist(d[1]); })
        .attr("width", xHist.bandwidth())
        .on("mouseover", function(d) {   
            label.style("opacity", 1); 
            label.html("Number of " + d[0] + "s" + "<br>" + d[1]);
            label.style("visibility", "visible")
               .style("left", (d3.event.pageX - 80) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
        .on("mouseout", function() { label.style("visibility", "hidden");});

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
      // checking if correct records are inserted into that array
      //console.log(year1977); // 1
      //console.log(year1980); // 0
      //console.log(year1993); // 38
      
      // place each array into a combined array for updating purposes later
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


      // SCATTERPLOT START INITIAL SCATTERPLOT CONTAINS AGE AND DATE
      mindate = new Date(1977,0,1);
      maxdate = new Date(2017,11,31);
      xScatter.domain([mindate, maxdate])
      yScatter.domain([0,maxAge])
      
      // x Axis Scatter
      svgScatter.append("g")
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
      svgScatter.append("text")
        .attr("class","textX")
        .attr("id", "xLabelScatter")
        .style("text-anchor", "middle")
        .attr("y", heightScatter + 90)
        .attr("x", widthScatter / 2)
        .attr("font-size", 24)
        .text("Date of execution");

      // y Axis
      svgScatter.append("g")
        .attr("class", "axis")
        .attr("id", "yaxis")
        .call(d3.axisLeft(yScatter))
        .selectAll("text")
          .attr("font-size", 14);

      // y label
      svgScatter.append("text")
        .attr("class","textY")
        .attr("id", "yLabelScatter")
        .attr("transform", "rotate(-90)")
        .attr("y", -60)
        .attr("x", 400 - heightScatter)
        .attr("font-size", 24)
        .style("text-anchor", "middle")
        .text("Age of the convicted");

      svgScatter.selectAll(".dot")
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
    
        // mapping of each category for scatterplot
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

      d3.select('#yAge')
        .on("click", yAge);
      d3.select('#yRace')
        .on("click", yRace);
      d3.select('#ySex')
        .on("click", ySex);
      d3.select('#yVictim')
        .on("click", yVictim);
      d3.select('#yType')
        .on("click", yType);
      d3.select('#yState')
        .on("click", yState);
      
      yScatterCounter = 100;
      // SCATTERPLOT END


  // csv load function end
  });


  // HELPER FUNCTIONS

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
        .transition()
        .duration(2000)
        .attr("x", function(d) { return xHist(d[0]); })
        .attr("y", function(d) { return yHist(d[1]); })
        .attr("height", function(d) { return height - yHist(d[1]); })
        .attr("width", xHist.bandwidth())
        .on("mouseover", function(d) {   
            label.style("opacity", 1); 
            label.html("Number of " + d[0] + "s" + "<br>" + d[1]);
            label.style("visibility", "visible")
               .style("left", (d3.event.pageX - 80) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
        .on("mouseout", function() { label.style("visibility", "hidden");});

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
        .transition()
        .duration(2000)
        .attr("x", function(d) { return xHist(d[0]); })
        .attr("y", function(d) { return yHist(d[1]); })
        .attr("height", function(d) { return height - yHist(d[1]); })
        .attr("width", xHist.bandwidth())
        .on("mouseover", function(d) {   
            label.style("opacity", 1); 
            label.html("Number of " + d[0] + "s" + "<br>" + d[1]);
            label.style("visibility", "visible")
               .style("left", (d3.event.pageX - 80) + "px")
               .style("top", (d3.event.pageY - 60) + "px"); })
        .on("mouseout", function() { label.style("visibility", "hidden");});

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




// scatterplot dropdown helpers
      // drawing the data based on the age on the x-axis
      function xAge() {
        yScatterCounter = getScatterCounterY();
        xScatterCounter = 1; // Age
        
        svgScatter.selectAll("#xaxis").remove();
        svgScatter.selectAll("#yaxis").remove();
        svgScatter.selectAll("#xLabelScatter").remove();
        svgScatter.selectAll("#yLabelScatter").remove();
        svgScatter.selectAll(".xAxis").remove();
        svgScatter.selectAll(".yAxis").remove();
        svgScatter.selectAll("circle").remove();
        svgScatter.selectAll(".bar").remove();

        //yScatterCounter = 100; // barplot
        xScatter = d3.scaleBand().rangeRound([0, widthScatter]).padding(0.6);
        xScatter.domain(["20-30", "30-40", "40-50", "50-60", "60-70"]);

        yScatter = d3.scaleLinear().rangeRound([heightScatter, 0]);
        yScatter.domain([0, 1250]);

        xAxisScatter = d3.axisBottom()
          .scale(xScatter);

        yAxisScatter = d3.axisLeft()
          .scale(yScatter);

        ageData = d3.nest()
              .key(function(d) { return d.Age; })
                .entries(copyOfData);

        console.log(ageData);

        // bar heights for histogram
        // ages are binned with 10 year intervals
        var tt = [20,21,22,23,24,25,26,27,28,29];
        var tf = [30,31,32,33,34,35,36,37,38,39];
        var ff = [40,41,42,43,44,45,46,47,48,49];
        var fs = [50,51,52,53,54,55,56,57,58,59];
        var ss = [60,61,62,63,64,65,66,67,68,69];
        a1 = 0;
        a2 = 0;
        a3 = 0;
        a4 = 0;
        a5 = 0;
        agesX = ["20-30","30-40","40-50","50-60","60-70"];

        for (j = 0; j < ageData.length; j++) {
          if (tt.includes(Number(ageData[j].key)) == true) {
            a1 = a1 + ageData[j].values.length;
          }
          if (tf.includes(Number(ageData[j].key)) == true) {
            a2 = a2 + ageData[j].values.length;
          }
          if (ff.includes(Number(ageData[j].key)) == true) {
            a3 = a3 + ageData[j].values.length;
          }
          if (fs.includes(Number(ageData[j].key)) == true) {
            a4 = a4 + ageData[j].values.length;
          }
          else {
            a5 = a5 + ageData[j].values.length;
          }
        }
        
        var ageData =  [a1, a2, a3, a4, a5];
        var agePlot = [];
        for (i = 0; i < ageData.length; i++) {
            agePlot[i] = [agesX[i], ageData[i]];
        }

        // x - axis
        svgScatter.append("g")
          .attr("class", "xAxis")
          .attr("transform", "translate(0," + heightScatter + ")")
          .style("font-size", 16)
          .call(xAxisScatter);

        svgScatter.append("text")
          .attr("class","textX")
          .attr("id", "xLabelScatter")
          .style("text-anchor", "middle")
          .attr("y", heightScatter + 60)
          .attr("x", widthScatter / 2)
          .attr("font-size", 24)
          .text("Age of convicted");

        //y-axis
        svgScatter.append("g")
          .attr("class", "yAxis")
          .style("font-size", 16)
          .call(yAxisScatter);

        // y label
        svgScatter.append("text")
          .attr("class","textY")
          .attr("id", "yLabelScatter")
          .attr("transform", "rotate(-90)")
          .attr("font-size", 24)
          .attr("y", -75)
          .attr("x", 100 - height)
          .style("text-anchor", "middle")
          .text("Total number of convicted people");

        // drawing the individual bars
        svgScatter.selectAll(".bar")
          .data(agePlot)
          .enter()
          .append("rect")
          .transition()
          .duration(1000)
          .attr("class", "bar")
          .attr("x", function(d) { return xScatter(d[0]); })
          .attr("y", function(d) { if (yScatterCounter == 1 || 
                                       yScatterCounter == 100) { 
                                          return yScatter(d[1]);
                                    }
                                  })
          .attr("height", function(d) { return heightScatter - yScatter(d[1]); })
          .attr("width", xScatter.bandwidth())

          // draw labels here
      }

      function xRace() {
        yScatterCounter = getScatterCounterY();
        xScatterCounter = 2 // race;
        
        svgScatter.selectAll("#xaxis").remove();
        svgScatter.selectAll("#yaxis").remove();
        svgScatter.selectAll("#xLabelScatter").remove();
        svgScatter.selectAll("#yLabelScatter").remove();
        svgScatter.selectAll(".xAxis").remove();
        svgScatter.selectAll(".yAxis").remove();
        svgScatter.selectAll("circle").remove();
        svgScatter.selectAll(".bar").remove();

        xScatter = d3.scaleBand().rangeRound([0, widthScatter]).padding(0.5);
        xScatter.domain(races);

        yScatter = d3.scaleLinear().rangeRound([heightScatter, 0]);
        yScatter.domain([0, 850]);

        xAxisScatter = d3.axisBottom()
          .scale(xScatter);

        yAxisScatter = d3.axisLeft()
          .scale(yScatter);

        raceData = d3.nest()
              .key(function(d) { return d.Race; })
                .entries(copyOfData);

        // bar heights for histogram
        var r1 = raceData[0].values.length;
        var r2 = raceData[1].values.length;
        var r3 = raceData[2].values.length;
        var r4 = raceData[3].values.length;
        var r5 = raceData[4].values.length;
        var r6 = raceData[5].values.length;

        var raceData =  [r1, r2, r3, r4, r5, r6];
        
        // place data in a neat way when drawing the bar chart.
        var racePlot = [];
        for (i = 0; i < raceData.length; i++) {
            racePlot[i] = [races[i], raceData[i]];
        }

        // x - axis
        svgScatter.append("g")
          .attr("class", "xAxis")
          .attr("transform", "translate(0," + heightScatter + ")")
          .style("font-size", 16)
          .call(xAxisScatter);

        svgScatter.append("text")
          .attr("class","textX")
          .attr("id", "xLabelScatter")
          .style("text-anchor", "middle")
          .attr("y", heightScatter + 60)
          .attr("x", widthScatter / 2)
          .attr("font-size", 24)
          .text("Race of convicted");
        //y-axis
        svgScatter.append("g")
          .attr("class", "yAxis")
          .style("font-size", 16)
          .call(yAxisScatter);

                // y label
        svgScatter.append("text")
          .attr("class","textY")
          .attr("id", "yLabelScatter")
          .attr("transform", "rotate(-90)")
          .attr("font-size", 24)
          .attr("y", -75)
          .attr("x", 100 - height)
          .style("text-anchor", "middle")
          .text("Total number of convicted people");

        // drawing the individual bars
        svgScatter.selectAll(".bar")
          .data(racePlot)
          .enter()
          .append("rect")
          .transition()
          .duration(1000)
          .attr("class", "bar")
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

      function xSex() {
        yScatterCounter = getScatterCounterY();
        xScatterCounter = 3 // sex;
        
        svgScatter.selectAll("#xaxis").remove();
        svgScatter.selectAll("#yaxis").remove();
        svgScatter.selectAll("#xLabelScatter").remove();
        svgScatter.selectAll("#yLabelScatter").remove();
        svgScatter.selectAll(".xAxis").remove();
        svgScatter.selectAll(".yAxis").remove();
        svgScatter.selectAll("circle").remove();
        svgScatter.selectAll(".bar").remove();


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
        svgScatter.append("g")
          .attr("class", "xAxis")
          .attr("transform", "translate(0," + heightScatter + ")")
          .style("font-size", 16)
          .call(xAxisScatter);

        svgScatter.append("text")
          .attr("class","textX")
          .attr("id", "xLabelScatter")
          .style("text-anchor", "middle")
          .attr("y", heightScatter + 60)
          .attr("x", widthScatter / 2)
          .attr("font-size", 24)
          .text("Sex of convicted");
        
        //y-axis
        svgScatter.append("g")
          .attr("class", "yAxis")
          .style("font-size", 16)
          .call(yAxisScatter);

                // y label
        svgScatter.append("text")
          .attr("class","textY")
          .attr("id", "yLabelScatter")
          .attr("transform", "rotate(-90)")
          .attr("font-size", 24)
          .attr("y", -75)
          .attr("x", 100 - height)
          .style("text-anchor", "middle")
          .text("Total number of convicted people");

        // drawing the individual bars
        svgScatter.selectAll(".bar")
          .data(sexPlot)
          .enter()
          .append("rect")
          .transition()
          .duration(1000)
          .attr("class", "bar")
          .attr("x", function(d) { return xScatter(d[0]); })
          .attr("y", function(d) { if (yScatterCounter == 1 || 
                                       yScatterCounter == 100) { 
                                          return yScatter(d[1]);
                                    }
                                  })
          .attr("height", function(d) { return heightScatter - yScatter(d[1]); })
          .attr("width", xScatter.bandwidth())

      }

      function xState() {
        yScatterCounter = getScatterCounterY();
        xScatterCounter = 4; // State

        svgScatter.selectAll("#xaxis").remove();
        svgScatter.selectAll("#yaxis").remove();
        svgScatter.selectAll("#xLabelScatter").remove();
        svgScatter.selectAll("#yLabelScatter").remove();
        svgScatter.selectAll(".xAxis").remove();
        svgScatter.selectAll(".yAxis").remove();
        svgScatter.selectAll("circle").remove();
        svgScatter.selectAll(".bar").remove();

          
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
        var s1 = stateData[0].values.length;
        var s2 = stateData[1].values.length;
        var s3 = stateData[2].values.length;
        var s4 = stateData[3].values.length;
        var s5 = stateData[4].values.length;
        var s6 = stateData[5].values.length;
        var s7 = stateData[6].values.length;
        var s8 = stateData[7].values.length;
        var s9 = stateData[8].values.length;
        var s10 = stateData[9].values.length;
        var s11 = stateData[10].values.length;
        var s12 = stateData[11].values.length;
        var s13 = stateData[12].values.length;
        var s14 = stateData[13].values.length;
        var s15 = stateData[14].values.length;
        var s16 = stateData[15].values.length;
        var s17 = stateData[16].values.length;
        var s18 = stateData[17].values.length;
        var s19 = stateData[18].values.length;
        var s20 = stateData[19].values.length;
        var s21 = stateData[20].values.length;
        var s22 = stateData[21].values.length;
        var s23 = stateData[22].values.length;
        var s24 = stateData[23].values.length;
        var s25 = stateData[24].values.length;
        var s26 = stateData[25].values.length;
        var s27 = stateData[26].values.length;
        var s28 = stateData[27].values.length;
        var s29 = stateData[28].values.length;
        var s30 = stateData[29].values.length;
        var s31 = stateData[30].values.length;
        var s32 = stateData[31].values.length;
        var s33 = stateData[32].values.length;
        var s34 = stateData[33].values.length;
        var s35 = stateData[34].values.length;

        var stateData =  [s1, s2, s3, s4, s5,
                          s6, s7, s8, s9, s10,
                          s11, s12, s13, s14, s15,
                          s16, s17, s18, s19, s20,
                          s21, s22, s23, s24, s25,
                          s26, s27, s28, s29, s30,                          
                          s31, s32, s33, s34, s35];
        
        var statePlot = [];
        for (i = 0; i < stateData.length; i++) {
            statePlot[i] = [states[i], stateData[i]];
        }

        // x - axis
        svgScatter.append("g")
          .attr("class", "xAxis")
          .attr("transform", "translate(0," + heightScatter + ")")
          .style("font-size", 14)
          .call(xAxisScatter);

        svgScatter.append("text")
          .attr("class","textX")
          .attr("id", "xLabelScatter")
          .style("text-anchor", "middle")
          .attr("y", heightScatter + 60)
          .attr("x", widthScatter / 2)
          .attr("font-size", 24)
          .text("State of execution");

        //y-axis
        svgScatter.append("g")
          .attr("class", "yAxis")
          .style("font-size", 16)
          .call(yAxisScatter);

                // y label
        svgScatter.append("text")
          .attr("class","textY")
          .attr("id", "yLabelScatter")
          .attr("transform", "rotate(-90)")
          .attr("font-size", 24)
          .attr("y", heightScatter - 725)
          .attr("x", 100 - height)
          .style("text-anchor", "middle")
          .text("Total number of convicted people");

        // drawing the individual bars
        svgScatter.selectAll(".bar")
          .data(statePlot)
          .enter()
          .append("rect")
          .transition()
          .duration(1000)
          .attr("class", "bar")
          .attr("x", function(d) {return xScatter(d[0]); })
          .attr("y", function(d) { if (yScatterCounter == 100) {return yScatter(d[1]);} })
          .attr("height", function(d) { return heightScatter - yScatter(d[1]); })
          .attr("width", xScatter.bandwidth())
      }

      function xType() {
        yScatterCounter = getScatterCounterY();
        xScatterCounter = 5; // type

        svgScatter.selectAll("#xaxis").remove();
        svgScatter.selectAll("#yaxis").remove();
        svgScatter.selectAll("#xLabelScatter").remove();
        svgScatter.selectAll("#yLabelScatter").remove();
        svgScatter.selectAll(".xAxis").remove();
        svgScatter.selectAll(".yAxis").remove();
        svgScatter.selectAll("circle").remove();
        svgScatter.selectAll(".bar").remove();
        //yScatterCounter = 100; // barplot
        xScatter = d3.scaleBand().rangeRound([0, widthScatter]).padding(0.5);
        xScatter.domain(method);

        yScatter = d3.scaleLinear().rangeRound([heightScatter, 0]);
        yScatter.domain([0, 200]);

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
        svgScatter.append("g")
          .attr("class", "xAxis")
          .attr("transform", "translate(0," + heightScatter + ")")
          .style("font-size", 16)
          .call(xAxisScatter);

        svgScatter.append("text")
          .attr("class","textX")
          .attr("id", "xLabelScatter")
          .style("text-anchor", "middle")
          .attr("y", heightScatter + 60)
          .attr("x", widthScatter / 2)
          .attr("font-size", 24)
          .text("Type of execution");
        //y-axis
        svgScatter.append("g")
          .attr("class", "yAxis")
          .style("font-size", 16)
          .call(yAxisScatter);

                // y label
        svgScatter.append("text")
          .attr("class","textY")
          .attr("id", "yLabelScatter")
          .attr("transform", "rotate(-90)")
          .attr("font-size", 24)
          .attr("y", -75)
          .attr("x", 100 - height)
          .style("text-anchor", "middle")
          .text("Total number of convicted people");

        // drawing the individual bars
        svgScatter.selectAll(".bar")
          .data(typePlot)
          .enter()
          .append("rect")
          .transition()
          .duration(1000)
          .attr("class", "bar")
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
        yScatterCounter = getScatterCounterY();
        xScatterCounter = 6; // victim
        
        svgScatter.selectAll("#xaxis").remove();
        svgScatter.selectAll("#yaxis").remove();
        svgScatter.selectAll("#xLabelScatter").remove();
        svgScatter.selectAll("#yLabelScatter").remove();
        svgScatter.selectAll(".xAxis").remove();
        svgScatter.selectAll(".yAxis").remove();
        svgScatter.selectAll("circle").remove();
        svgScatter.selectAll(".bar").remove();

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
        svgScatter.append("g")
          .attr("class", "xAxis")
          .attr("transform", "translate(0," + heightScatter + ")")
          .style("font-size", 16)
          .call(xAxisScatter);

        svgScatter.append("text")
          .attr("class","textX")
          .attr("id", "xLabelScatter")
          .style("text-anchor", "middle")
          .attr("y", heightScatter + 60)
          .attr("x", widthScatter / 2)
          .attr("font-size", 24)
          .text("Number of victims");
        
        //y-axis
        svgScatter.append("g")
          .attr("class", "yAxis")
          .style("font-size", 16)
          .call(yAxisScatter);

                // y label
        svgScatter.append("text")
          .attr("class","textY")
          .attr("id", "yLabelScatter")
          .attr("transform", "rotate(-90)")
          .attr("font-size", 24)
          .attr("y", -75)
          .attr("x", 100 - height)
          .style("text-anchor", "middle")
          .text("Total number of convicted people");

        // drawing the individual bars
        svgScatter.selectAll(".bar")
          .data(victimsPlot)
          .enter()
          .append("rect")
          .transition()
          .duration(1000)
          .attr("class", "bar")
          .attr("x", function(d) { return xScatter(d[0]); })
          .attr("y", function(d) { if (yScatterCounter == 1 || 
                                       yScatterCounter == 100) { 
                                          return yScatter(d[1]);
                                    }
                                  })
          .attr("height", function(d) { return heightScatter - yScatter(d[1]); })
          .attr("width", xScatter.bandwidth())


      } 


      function yAge() {
        yScatterCounter = 1;
        xScatterCounter = getScatterCounterx();

        xScatter = d3.scaleBand().rangeRound([0, widthScatter]).padding(0.6);
        xScatter.domain(["1", "2", "3", "4", "5", "> 5"]);

        var yScatter = d3.scaleLinear()
          .domain([0, d3.max(copyOfData, function(d) {  return d3.max(d, function(d) { return d.Age0 + d.Age; });  })])
          .range([height, 0]);

        var colors = ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"];

        // Create groups for each series, rects for each segment 
        var groups = svgScatter.selectAll("g.cost")
          .data(copyOfData)
          .enter().append("g")
          .attr("class", "cost")
          .style("fill", function(d, i) { return colors[i]; });

        var rect = groups.selectAll("rect")
          .data(function(d) { return d; })
          .enter()
          .append("rect")
          .attr("x", function(d) { return xScatter(d.x); })
          .attr("y", function(d) { return yScatter(d.Age0 + d.Age); })
          .attr("height", function(d) { return yScatter(d.Age0) - yScatter(d.Age0 + d.Age); })
          .attr("width", xScatter.bandwidth())

       
        console.log("y age")
      }
      function yRace() {
        yScatterCounter = 2;
        xScatterCounter = getScatterCounterx();
        console.log("y race")
      }
      function ySex() {
        yScatterCounter = 3;
        xScatterCounter = getScatterCounterx();
        console.log("y gender")
      }
      function yState() {
        yScatterCounter = 4;
        xScatterCounter = getScatterCounterx();
        console.log("y state")
      }
      function yType() {
        yScatterCounter = 5;
        xScatterCounter = getScatterCounterx();
        console.log("y type")
      }
      function yVictim() {
        yScatterCounter = 6;
        xScatterCounter = getScatterCounterx();
        console.log("y victims")
      }


      function calculateVictims(data) {
          var aString = data["Number / Race / Sex of Victims"];
          var sumVictims = aString.match(/\d+/g).map(Number).reduce((a, b) => a + b, 0);
          return sumVictims; // no scaling for histogram
      }

      function getScatterCounterx() {
        return xScatterCounter;
      }

      function getScatterCounterY() {
        return yScatterCounter;
      }

// init function end
}   

 
 

