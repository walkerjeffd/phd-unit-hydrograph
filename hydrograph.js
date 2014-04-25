// global objects
var parameters,
    lineFunction;

// execute code when document is loaded
window.onload = function() {
  parameters = {Tp: 1, m: 1}; // set initial values
  createChart();              // create svg chart
  bindSliderEvents();         // bind slider events
};

function bindSliderEvents() {
  // bind change event to each slider
  d3.selectAll(".slider").on("input", function() {
    // update slider label with current value
    d3.selectAll("#param-"+this.name).text(this.value);

    // set value in parameters object
    parameters[this.name] = +this.value;

    // update chart with new parameters
    updateLine();
  });
}

function compute(m, Tp) {
  // array of time points to compute flows
  var times = d3.range(0, 10, 0.01);

  // set up empty array to store computed [time, flow] data points
  var results = [];

  for (var i = 0; i < times.length; i++) {
    // get current time, compute flow, and add [time, flow] pair to results array
    var time = times[i];
    var flow = Math.exp(m) * Math.pow(time/Tp, m) * (Math.exp(-m*time/Tp));
    results.push([time, flow]);
  }

  return results;
}

function updateLine() {
  // compute flows
  var data = compute(parameters['m'], parameters['Tp']);

  // select line and bind new data
  var lines = d3.select('#chart').selectAll('.line')
    .data([data]);

  // update line elements in svg chart
  lines.attr("d", lineFunction);
}

function createChart() {
  // define size and margins of chart
  var margin = {top: 30, right: 20, bottom: 30, left: 50},
      width = 500,
      height = 300;

  // set up x and y scales that maps x and y values to pixel positions
  var xScale = d3.scale.linear().nice()
        .range([0, width - margin.left - margin.right])
        .domain([0, 10]);
  var yScale = d3.scale.linear().nice()
        .range([height - margin.top - margin.bottom, 0])
        .domain([0, 1]);

  // define x and yaxes
  var xAxis = d3.svg.axis().orient("bottom").scale(xScale),
      yAxis = d3.svg.axis().orient("left").scale(yScale);

  // create line function that maps array of values to pixel locations
  lineFunction = d3.svg.line()
    .x(function(d) { return xScale(d[0]);})
    .y(function(d) { return yScale(d[1]);});

  // create svg plot in #chart element
  var svg = d3.select('#chart').append('svg')
      .attr("width", width)
      .attr("height", height);

  // add container for chart
  var g = svg.append('g')
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // add x axis to chart
  g.append('g').attr('class', 'x axis')
      .attr("transform", "translate(0," + yScale.range()[0] + ")")
      .call(xAxis)
    .append("text")
      .attr("y", 0)
      .attr("x", xScale.range()[1])
      .attr("dy", -5)
      .style("text-anchor", "end")
      .text('Time');

  // add y axis to chart
  g.append('g').attr('class', 'y axis')
      .call(yAxis)
    .append("text")
      .attr("y", 0)
      .attr("x", 5)
      .attr("dy", -5)
      .style("text-anchor", "start")
      .text('Unit Streamflow');

  // add a line to the chart for showing results
  g.append('path')
    .attr('class', 'line');

  updateLine();
}
