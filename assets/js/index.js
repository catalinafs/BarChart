// Fetch Variables
let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';
let req = new XMLHttpRequest();

// Bar Scales Variables
let heightScale, xScale;

// Axes Variables
let xAxisScale, yAxisScale;

// SVG Dimensions Variables
let width = 800, height = 500, padding = 40;

// Store the SVG Element
let svg = d3.select('svg');

// Function to add the width and height to the svg
function drawSvg() {
    svg.attr('width', width)
        .attr('height', height);
}

// Function to generate the scales
function generateScales(data) {
    heightScale = d3.scaleLinear()
        .domain([0, d3.max(data, (d) => { return d[1] })])
        .range([0, height - (2 * padding)]);

    xScale = d3.scaleLinear()
        .domain([0, data.length - 1])
        .range([padding, width - padding]);

    let datesArray = data.map((date) => {
        return new Date(date[0])
    });

    xAxisScale = d3.scaleTime()
        .domain([d3.min(datesArray), d3.max(datesArray)])
        .range([padding, width - padding]);

    yAxisScale = d3.scaleLinear()
        .domain([0, d3.max(data, (d) => { return d[1] })])
        .range([height - padding, padding]);
}

// Function to generate the axes
function generateAxes() {
    // Move the x-axis
    let xAxis = d3.axisBottom(xAxisScale);
    svg.append('g')
    .call(xAxis)
    .attr('id', 'x-axis')
    .attr('transform', `translate(0, ${height - padding})`);
    
    // Move the y-axis
    let yAxis = d3.axisLeft(yAxisScale);
    svg.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', `translate(${padding}, 0)`);
}

// Function to create the bars
function drawBars(data) {
    // Tooltip is created and styled
    d3.select('main')
    .append('div')
    .attr('id', 'tooltip')
    .style('opacity', 0)
    .style('position', 'absolute')
    .style('background-color', 'rgba(0,0,0,0.8)')
    .style('color', '#ffffff')
    .style('padding', '10px');
    
    // Bars are created and the tooltip is added
    svg.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('data-date', (d) => { return d[0] })
        .attr('data-gdp', (d) => { return d[1] })
        .attr('width', (width - (2 * padding)) / data.length)
        .attr('height', (d) => { return heightScale(d[1]) })
        .attr('x', (d, i) => { return xScale(i) })
        .attr('y', (d) => { return (height - padding) - heightScale(d[1]) })
        .attr('border', 'none')
        .on('mousemove', (e, d) => {
            const tooltip = d3.select('#tooltip');

            tooltip
                .style('opacity', 0.9)
                .style('left', e.pageX + 10 + 'px')
                .style('top', e.pageY + 10 + 'px')
                .style('font-size', '12px');

            tooltip.attr('data-date', d[0]).html(`${d[0]} <br> ${d[1]} Billion`);
        })
        .on('mouseout', () => {
            const tooltip = d3.select('#tooltip');

            tooltip.style('opacity', 0);
        });
}

/**
 * We make the request to the url and we tell it that we are making a 'GET' request 
 * and that the function is asynchronous.
 */
req.open('GET', url, true);
req.onload = () => {
    // Response Variables
    let response = JSON.parse(req.responseText);
    let data = response.data;

    // We call the functions and pass the data to those who need it
    drawSvg();
    generateScales(data);
    drawBars(data);
    generateAxes();
}
req.send();