d3.select(window).on('load', init);

function init() {
  d3.csv(
    'test.csv', 
    function(error, data) {
      if (error) throw error;
      console.log(data);
  		

      d3.select('body')
        .append('ul')
        .selectAll('li')
        .data(data)
        .enter()
        .append('li')
        .text(function(d){
          return d.letter+':'+
            d.frequency;
        });

    });

  	var scale = d3.scaleLinear()
      .domain([0,10])
      .range([0,1]);

	console.log(scale(5));


	var mydata = [[100, 237, 4], 
                [217, 132, 5], 
                [160, 110, 7], 
                [106, 123, 8]];

  var svg = d3.select('svg');
  var width = +svg.node().getBoundingClientRect().width;
  var height = +svg.node().getBoundingClientRect().height;  
  
  var padding = 50;


  var xScale = d3.scaleLinear()
      .domain([0,
               d3.max(mydata, 
                      function(d){
                        return d[0];
                      })])
      .range([0+padding,width-padding]);

  var yScale = d3.scaleLinear()
      .domain(d3.extent(mydata,
                        function(d){
                          return d[1];
                        }))
      .range([height-padding, 0+padding]);

  d3.select("#plotarea")
    .selectAll("circle")
    .data(mydata)
    .enter()
    .append("circle")
    .attr("r", "10px")
    .attr("cx", function(d){
                  return ""+ xScale(d[0])+"px";
                })
    .attr("cy", function(d){
                  return ""+yScale(d[1])+"px";
                })

}