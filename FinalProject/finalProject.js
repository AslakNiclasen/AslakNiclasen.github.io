// Set up on-load initialization
d3.select(window).on('load', init);

// Initialiation function. Called after body has loaded
function init() {

  // bar chart starting variables start here
  var margin = {top: 20, right: 30, bottom: 100, left: 100},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

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
  // bar chart starting variables end here

  // Timeline starting variables starts here
  // Timeline starting variables starts here
  var margin = {top: 20, right: 30, bottom: 100, left: 100},
      widthTimeline = 1200 - margin.left - margin.right,
      heightTimeline = 800 - margin.top - margin.bottom;

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
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  // Timeline starting variables ends here


  // LOADING CSV FILE AND START PLOTTING ALL PLOTS

  // load data and start plotting
  d3.csv("execution_database.csv", function(data) {

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

      var eMethods = ["Electrocution", "Lethal Injection", "Hanging", "Gas Chamber", "Firing Squad"];
      var histData =  [sumElectrocutions, sumLethalInjection, sumHanging, sumGasChamber, sumFiringSquad];
      
      // place data in a neat way when drawing the bar chart.
      var histPlot = [];
      for (i = 0; i < histData.length; i++) {
          histPlot[i] = [eMethods[i], histData[i]];
      }

      xHist.domain(histPlot.map(function(d) { return d[0]; }));
      
      // scaled domain, could have used logarithmic scale instead.
      yHist.domain([0, 200]); 
      // d3.max(histPlot, function(d) { return d[1]; })]);
      
      // x - axis
      svgHistogram.append("g")
        .attr("class", "xAxis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxisHist);

      // y - axis
      svgHistogram.append("g")
        .attr("class", "yAxis")
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
          .attr("transform", "rotate(-90)")
          .attr("y", -50)
          .attr("x", 150 - height/1.2)
          .style("text-anchor", "middle")
          .text("Number of executions");

      // x label
      svgHistogram.append("text")
          .attr("class","textX")
          .style("text-anchor", "middle")
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
      // BAR CHART PLOTTING END


      // TIMELINE START
      // date manipulation into individual arrays for slider update
      // grouping all instances within a year together.
      var year1977 = [];
      var year1978 = [];
      var year1979 = [];
      var year1980 = [];
      var year1981 = [];
      var year1982 = [];
      var year1983 = [];
      var year1984 = [];
      var year1985 = [];
      var year1986 = [];
      var year1987 = [];
      var year1988 = [];
      var year1989 = [];
      var year1990 = [];
      var year1991 = [];
      var year1992 = [];
      var year1993 = [];
      var year1994 = [];
      var year1995 = [];
      var year1996 = [];
      var year1997 = [];
      var year1998 = [];
      var year1999 = [];
      var year2000 = [];
      var year2001 = [];
      var year2002 = [];
      var year2003 = [];
      var year2004 = [];
      var year2005 = [];
      var year2006 = [];
      var year2007 = [];
      var year2008 = [];
      var year2009 = [];
      var year2010 = [];
      var year2011 = [];
      var year2012 = [];
      var year2013 = [];
      var year2014 = [];
      var year2015 = [];
      var year2016 = [];
      var year2017 = [];
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
      
      // date domain - initial year is 1990
      var mindate = new Date(1977,0,1);
      var maxdate = new Date(1977,11,31);
      xTimeline.domain([mindate, maxdate])
      
      // X Axis
      svgTimeline.append("g")
        .attr("class", "axis")
        .attr("id", "xaxis")
        .attr("transform", "translate(0," + heightTimeline + ")")
        .call(d3.axisBottom(xTimeline)
                .tickFormat(d3.timeFormat("%d-%b-%Y")))
        .selectAll("text")  
          .style("text-anchor", "center")
          .attr("font-size", 10)
          .attr("dx", "0em")
          .attr("dy", "2em");
          //.attr("transform", "rotate(-65)");

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

        /* Slider for Years*/
        var slider = d3.sliderHorizontal()
               .min(1977)
               .max(2017)
               .step(1)
               .width(700)
               .on('onchange', val => {
                    // update plot
                    updateTimeline(val, allYears);
               })

        var g = d3.select("div#sliderIdTimeline").append("svg")
            .attr("width", 1000)
            .attr("height", 100)
            .attr("font-size", 5)
            .attr("font-family", "calibri")
            .append("g")
            .attr("transform", "translate(200,0)");

        g.call(slider);


        slider.axis = function(_) {
          if (!arguments.length) return axis;
            axis = 1;
          return slider;
        }
      // TIMELINE END

  // csv load function end
  });

  // Helper functions below

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

  // In order to set the size of the circles we
  // need to calculate how many victims are present.
  // luckily we can parse the string and return the sum of all numbers within.
  // simple example which return the number 3
  // var string = "2 White Male(s)1 White Female(s)" 
  // var testSum = string.match(/\d+/g).map(Number).reduce((a, b) => a + b, 0);
  // console.log(testSum);
  function calculateCircleRadius(data) {
    var aString = data["Number / Race / Sex of Victims"];
    var sumVictims = aString.match(/\d+/g).map(Number).reduce((a, b) => a + b, 0);
    return sumVictims * 2.5;
  }

  // Updating timeline view based on slider position
  // Fetch new data view changing x axis domain and updating points based on data
  function updateTimeline(val, allData) {

      startDate = new Date(val,0,1);
      endDate = new Date(val,11,31);
      xTimeline.domain([startDate, endDate]);
      console.log(startDate)
      console.log(endDate)

      svgTimeline.selectAll("circle").remove()
      
      svgTimeline.selectAll("#xaxis").remove()

      // x Axis redrawn
        svgTimeline.append("g")
          .attr("class", "axis")
          .attr("id", "xaxis")
          .attr("transform", "translate(0," + heightTimeline + ")")
          .call(d3.axisBottom(xTimeline)
                  .tickFormat(d3.timeFormat("%d-%b-%Y")))
          .selectAll("text")  
            .style("text-anchor", "center")
            .attr("font-size", 10)
            .attr("dx", "0em")
            .attr("dy", "2em");


      svgTimeline.selectAll(".dot")
        .data(getYear(val, allData)) // initially set at 1977
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("stroke", function(d) { return pickCircleColor(d); })
        .attr("stroke-width", 2)
        .attr("fill", function(d) { return pickCircleColor(d); })
        .attr("opacity", 0.5)
        .attr("r", function(d) { return (calculateCircleRadius(d) + 1); })
        .attr("cx", function(d) { 
                                  // fixing an additional parsing of dates
                                  // by formatting and reparsing
                                  d1 = d;
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
        .attr("cy", function(d) { return yTimeline(d.Age); });

        // tooltip providing information on the execution.
        // not implemented yet
        //.on("mouseover", updatePlot1)
        //.on("mouseout", updatePlot2);

        // create button such that the entire plot shows all points at the entire scale.
        // change x domain - easy
        // draw all points with smaller radius

      //d3.select("#xLabel").text("Principal Component " + val);
  }


  // A poor way of picking the correct array for the timeline
  // but easy and intuitive
  function getYear(val, allYears) {
    if (val == 1977) {
      return allYears[0];
    }
    else if (val == 1978) {
      return allYears[1];
    }
    else if (val == 1979) {
      return allYears[2];
    }
    else if (val == 1980) {
      return allYears[3];
    }
    else if (val == 1981) {
      return allYears[4];
    }
    else if (val == 1982) {
      return allYears[5];
    }
    else if (val == 1983) {
      return allYears[6];
    }
    else if (val == 1984) {
      return allYears[7];
    }
    else if (val == 1985) {
      return allYears[8];
    }
    else if (val == 1986) {
      return allYears[9];
    }
    else if (val == 1987) {
      return allYears[10];
    }
    else if (val == 1988) {
      return allYears[11];
    }
    else if (val == 1989) {
      return allYears[12];
    }
    else if (val == 1990) {
      return allYears[13];
    }
    else if (val == 1991) {
      return allYears[14];
    }
    else if (val == 1992) {
      return allYears[15];
    }
    else if (val == 1993) {
      return allYears[16];
    }
    else if (val == 1994) {
      return allYears[17];
    }
    else if (val == 1995) {
      return allYears[18];
    }
    else if (val == 1996) {
      return allYears[19];
    }
    else if (val == 1997) {
      return allYears[20];
    }
    else if (val == 1998) {
      return allYears[21];
    }
    else if (val == 1999) {
      return allYears[22];
    }
    else if (val == 2000) {
      return allYears[23];
    }
    else if (val == 2001) {
      return allYears[24];
    }
    else if (val == 2002) {
      return allYears[25];
    }
    else if (val == 2003) {
      return allYears[26];
    }
    else if (val == 2004) {
      return allYears[27];
    }
    else if (val == 2005) {
      return allYears[28];
    }
    else if (val == 2006) {
      return allYears[29];
    }
    else if (val == 2007) {
      return allYears[30];
    }
    else if (val == 2008) {
      return allYears[31];
    }
    else if (val == 2009) {
      return allYears[32];
    }
    else if (val == 2010) {
      return allYears[33];
    }
    else if (val == 2011) {
      return allYears[34];
    }
    else if (val == 2012) {
      return allYears[35];
    }
    else if (val == 2013) {
      return allYears[36];
    }
    else if (val == 2014) {
      return allYears[37];
    }
    else if (val == 2015) {
      return allYears[38];
    }
    else if (val == 2016) {
      return allYears[39];
    }
    else if (val == 2017) {
      return allYears[40];
    }
  }



// init function end
}