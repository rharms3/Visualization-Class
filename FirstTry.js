<html>
<script src='https://d3js.org/d3.v5.min.js'></script>
<style> circle {fill: lightblue; stroke: black;} </style>
<body onload='init()'>
<svg width=300 height=300>
</svg>
<script>
async function init() {
const data = await d3.csv('https://flunky.github.io/cars2017.csv');

var x = d3.scaleLog().domain([10,150]).range([0,200]);
var y = d3.scaleLog().domain([10,150]).range([200,0]);
const margin = ( 50 );
const height = ( 200 );
const width = ( 200 );
const radplus = ( 2 );

var xAxis = d3.axisBottom(x)
        .tickValues([10,20,50,100])
        .tickFormat(d3.format(".0s"));

var yAxis = d3.axisLeft(y)
        .tickValues([10,20,50,100])
        .tickFormat(d3.format(".0s"));

xdomain = [10,150];
xrange = [0,200];
ydomain = [10,150];
yrange = [200,0];

xs = d3.scaleLog().domain(xdomain).range(xrange);
ys = d3.scaleLog().domain(ydomain).range(yrange);

d3.select("svg")
    .attr("width",width + margin + margin)
    .attr("height",height + margin + margin)
    .append("g")
       .attr("transform","translate("+ margin +","+ margin +")")
       .selectAll('circle')
	  .data(data)
	  .enter()
	  .append('circle')
	    .attr('cx',function(d) {return xs(d.AverageCityMPG);})
	    .attr('cy',function(d) {return ys(d.AverageHighwayMPG);})
	    .attr('r',function(d) {return +radplus + +d.EngineCylinders;});

d3.select("svg").append("g")
    .attr("transform","translate("+ margin +","+ margin +")")
    .call(yAxis)


d3.select("svg").append("g")
    .attr("transform","translate("+ margin +","+(height + margin)+")")
    .call(xAxis);
}
</script>
</body>
</html>
