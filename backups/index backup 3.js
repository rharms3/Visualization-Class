
var crime_dataObj;
var var_year = 2015;  // set a call to a subroutine and pass the year based on the selection???

var svg = d3.select('svg')
  .attr("width",800)
  .attr("height",600);

  var div = d3.select('body')
  .append('div')
  .attr('id', 'tooltip')
  .attr('style', 'position:relative ; opacity:1;');

//<script>
async function init() {

const proxyurl = "https://cors-anywhere.herokuapp.com/";
const url = "http://s3-us-gov-west-1.amazonaws.com/cg-d4b776d0-d898-4153-90c8-8336f86bdfec/estimated_crimes_1979_2018_rev1.csv";

//load csv and copy to global variable
const crime_dataObj = await d3.csv(proxyurl + url);
filtered = crime_dataObj.filter(function(data) {
return (data.state_abbr != "" & data.year == var_year);
})

filtered.forEach(function(d) {
    d.population = +d.population;
    d.aggravated_assault= +d.aggravated_assault;
    d.burglary= +d.burglary;
    d.homicide= +d.homicide;
    d.larceny= +d.larceny;
    d.motor_vehicle_theft= +d.motor_vehicle_theft;
    d.property_crime= +d.property_crime;
    d.rape_legacy= +d.rape_legacy;
    d.rape_revised= +d.rape_revised;
    d.robbery= +d.robbery;
    d.violent_crime= +d.violent_crime;
    d.comb_rape = +d.rape_legacy + d.rape_revised;
    d.total_crime = +d.violent_crime + d.property_crime;
    d.year = +d.year;
  })

var xlength = d3.max(filtered, function(d) { return d.total_crime;});
var ylength = d3.max(filtered, function(d) { return d.population;});
var xlengthmin = d3.min(filtered, function(d) { return d.total_crime;});
var ylengthmin = d3.min(filtered, function(d) { return d.population;});

//console.log("xmax =" + xlength);
//console.log("xmin =" + xlengthmin);
//console.log("ymax =" + ylength);
// console.log("ymin =" + ylengthmin);

const margin = ( 50 );
const height = ( 600 );
const width = ( 600 );
const radplus = ( 2 );

var x = d3.scaleLog().domain([xlengthmin,xlength]).range([0,width]);  //500
var y = d3.scaleLog().domain([ylengthmin,ylength]).range([height,0]);  //500

var xAxis = d3.axisBottom(x)
        .tickValues([(xlength*.25),(xlength*.5),(xlength*.75),xlength])
        .tickFormat(d3.format(".0s"));

var yAxis = d3.axisLeft(y)
//        .tickValues([10,20,50,100])
        .tickFormat(d3.format(".0s"));

xdomain = [xlengthmin,xlength];
xrange = [0,width];
ydomain = [ylengthmin,ylength];
yrange = [height,0];

xs = d3.scaleLog().domain(xdomain).range(xrange);
ys = d3.scaleLog().domain(ydomain).range(yrange);

//crime_data.then(function(data) {
  d3.select("svg")
    .attr("width",width + margin + margin)
    .attr("height",height + margin + margin)
    .append("g")
        .attr("transform","translate("+ margin +","+ margin +")")
    .selectAll('circle')
	  .data(filtered)
	  .enter()
	  .append('circle')
	    .attr('cx',function(data) {return xs(data.total_crime);})
	    .attr('cy',function(data) {return ys(data.population);})
	    .attr('r',function(data,i) {return +radplus + +5;})

    // .on("mouseover", function(d){
    //   d3.select(this).raise().attr("r",10).style("fill","red")
    //   d3.select(this.parentNode)
    //     .append("text")
    //     .attr("class", "car")
    //     .attr('x',function () { return (d3.mouse(this)[0] + 10);})
    //     .attr('y',function () { return (d3.mouse(this)[1] + 10);})
    //     .text(d.year + ": Total Crime = " + d.total_crime + " in " + d.state_abbr)
    //  })
     .on("mouseover", function(d){
               current_position = d3.mouse(this);
               var tooltipDiv = document.getElementById('tooltip');
               tooltipDiv.innerHTML = d.id;
               tooltipDiv.style.top = function () { return (d3.mouse(this)[0] + 10);});
               tooltipDiv.style.left =  + current_position[0];
               tooltipDiv.style.display = "block";

               d3.select(this).style("fill", "red")
               .raise();
    })
    .on("mouseout", function(d){
      // d3.selectAll("text.car").remove()
      // d3.select(this).lower();

               d3.select(this).style("fill", "lightblue")
               .lower();
               var tooltipDiv = document.getElementById('tooltip');
               tooltipDiv.style.display = "none";
    })
    // .on("mouseout", function(d){
    //   d3.selectAll("text.car").remove()
    //   d3.select(this).lower().attr("r",function(data,i) {return +radplus + +5;}).style("fill","lightblue");
    // })

d3.select("svg").append("g")
    .attr("transform","translate("+ margin +","+ margin +")")
    .call(yAxis);

d3.select("svg").append("text")
     .attr("class","yaxislab")
     .attr("transform","translate("+ (margin - 40) +","+ (margin + (height / 2)) +") rotate(270)")
     .text("Population");

 d3.select("svg").append("g")
    .attr("transform","translate("+ margin +","+(height + margin)+")")
    .call(xAxis);

 d3.select("svg").append("text")
    .attr("class","xaxislab")
    .attr("transform","translate("+ (margin + (width / 2))+","+(height + margin + 30)+")")
    .text("Total Crime");
  };

  init();
