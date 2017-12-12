var margin = {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10
    },
    width = 1000,
    height = 450;
var kx = function (d) {
    return d.x - 35;
};
var ky = function (d) {
    return d.y - 10;
};
//this places the text x axis adjust this to center align the text
var tx = function (d) {
    return d.x - 30;
};
//this places the text y axis adjust this to center align the text
var ty = function (d) {
    return d.y + 3;
};
//make an SVG
var svg = d3.select("#graph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var root = {
    "name": "Donald Trump",
    "partners": [
        {
            "name": "Ivana Trump",
            "children": [
                {
                    "name": "Donald Trump Jr.",
                    "partners": [
                        {
                            "name": "Vanessa Trump",
                            "children": [
                                {
                                    "name": "Kai Madison"
                                },
                                {
                                    "name": "Donald III"
                                },
                                {
                                    "name": "Chloe Sophia"
                                },
                                {
                                    "name": "Tristan Milos"
                                },
                                {
                                    "name": "Spencer Frederick"
                                }
                            ]
                        }
                    ]
                },
                {
                    "name": "Ivanka Trump",
                    "partners": [
                        {
                            "name": "Jared Kushner",
                            "children": [
                                {
                                    "name": "Arabella Rose"
                                },
                                {
                                    "name": "Joseph Frederick"
                                },
                                {
                                    "name": "Theodore James"
                                }
                            ]
                        }
                    ]
                },
                {
                    "name": "Eric Trump",
                    "partners": [
                        {
                            "name": "Lara Yunaska"
                        }
                    ]
                }
            ]
        },
        {
            "name": "Marla Maples",
            "children": [
                {
                    "name": "Tiffany Trump"
                }
            ]
        },
        {
            "name": "Melanie Trump",
            "children": [
                {
                    "name": "Baron Trump"
                }
            ]
        }
    ]
}

// Compute the layout.
var tree = d3.layout.tree().size([width, height]);
var nodes_and_partners = flatten(root);
var allNodes = nodes_and_partners[0];
var partners = nodes_and_partners[1];
var links = tree.links(allNodes);

// Link lines.
svg.selectAll(".link")
    .data(links)
    .enter().append("path")
    .attr("class", "link")
    .attr("d", make_line);

// All nodes
var nodes = svg.selectAll(".node")
    .data(allNodes)
    .enter();

// Partner lines
svg.selectAll(".partner")
    .data(partners)
    .enter().append("path")
    .attr("class", "partner")
    .attr("d", partnerLine);

// Function to create line
var line2 = d3.svg.line()
    .x(function (d) { return d.x; })
    .y(function (d) { return d.y; });

// Line for legend
var partner_line = [
    { "x": 100,   "y": 350},
    { "x": 150,  "y": 350}
];

// Line for legend
var child_line = [
    { "x": 100,   "y": 380},
    { "x": 150,  "y": 380}
];

//  Add Partner line for legend
svg.append("path")
    .data([partner_line])
    .attr("class", "line2")
    .attr("d", line2)
    .style("stroke", "blue")
    .style("stroke-width", "5px")
    .attr("data-legend",function(d) {return d.x});

// Add Child line for legend
svg.append("path")
    .data([child_line])
    .attr("class", "line2")
    .attr("d", line2)
    .style("stroke", "lightblue")
    .style("stroke-width", "3px")
    .attr("data-legend",function(d) {return d.x});

// Text for legend
svg.append("text")
    .attr("x", 180)
    .attr("y", 353)
    .style("fill", "gray")
    .style("font-size", "14")
    .text("Partners");

svg.append("text")
    .attr("x", 180)  // space legend
    .attr("y", 383)
    .style("fill", "gray")
    .style("font-size", "14")
    .text("Child");

// Legend box
svg.append("rect")
    .attr("height", 70)
    .attr("width", 170)
    .attr("x", 90)
    .attr("y", 330)
    .style("border-radius","25px")
    .style("opacity", "0.1");

// Create the node rectangles.
nodes.append("rect")
    .attr("class", "node")
    .attr("height", 20)
    .attr("width", 90)
    .attr("id", function (d) {
        return d.name;
    })
    .attr("display", function (d) {
        if (d.hidden) {
            return "none"
        } else {
            return ""
        }
    })
    .attr("x", kx)
    .attr("y", ky)
    .style("border-radius","25px");
// Create the node text label.
nodes.append("text")
    .text(function (d) {
        return d.name;
    })
    .attr("x", tx)
    .attr("y", ty);


function flatten(root) {
    var n = [],
        p = [],
        depth = 0,
        x_pos = [100,100,100],
        depth_0 = [100, 350, 600, 850],
        index = 0;

    function recurse(node, depth) {
        node.x = x_pos[depth];
        x_pos[depth] += 120;

        node.depth = depth;
        node.y = depth * 100 + 100;
        if (depth === 0) {
            node.x = depth_0[index];
            index += 1;
        }
        n.push(node);
        if (node.partners) {
            node.partners.forEach(function(d) {
                var p_link = {
                    source: {
                        name: node.name,
                        x: node.x
                        },
                    target: {
                        name: d.name,
                        x: x_pos[depth]
                    }
                };
                p.push(p_link);
                recurse(d, depth);
            });
        }
        if (node.children) {
            node.children.forEach(function(d) {
                recurse(d, depth+1);
            });
        }
    }
    recurse(root, depth);
    return [n, p];
}


function partnerLine(d, i) {
    //start point
    var start = allNodes.filter(function (v) {
        return d.source.name === v.name;
    });
    //end point
    var end = allNodes.filter(function (v) {
        return d.target.name === v.name;
    });

    if (d.source.name === "Donald Trump") {
        var hop_y = 0;
        var hop_x = 0;
        if (end[0].name === "Ivana Trump") {
            hop_y = 0;
        }
        if (end[0].name === "Marla Maples") {
            hop_y = 20;
            hop_x = 10;
        }
        if (end[0].name === "Melanie Trump") {
            hop_y = 30;
            hop_x = 0;
        }
        var linedata = [{
            x: start[0].x,
            y: start[0].y
        }, {
            x: start[0].x+hop_x,
            y: start[0].y-hop_y
        }, {
            x: end[0].x,
            y: end[0].y
        }];
    } else {
        //define teh start coordinate and end co-ordinate
        var linedata = [{
            x: start[0].x,
            y: start[0].y
        }, {
            x: end[0].x,
            y: end[0].y
        }];
    }
    var fun = d3.svg.line().x(function (d) {
        return d.x;
    }).y(function (d) {
        return d.y;
    }).interpolate("step-after");
    return fun(linedata);
}

/**
 This draws the lines between nodes.
 **/
function make_line(d, i) {

    var source_x = partners.map(function (v) {
        if (d.source.name === v.target.name) {
            return (d.source.x + v.source.x) / 2;
        }
    }).filter(function(e) {
        return e !== undefined;
    });

    linedata = [{
        x: d.target.x,
        y: d.target.y
    }, {
        x: d.source.x,
        y: d.source.y
    }];

    var fun = d3.svg.line().x(function (d) {
        return d.x;
    }).y(function (d) {
        return d.y;
    }).interpolate("linear");
    return fun(linedata);
}
