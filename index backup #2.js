//<style> circle {fill: lightblue; stroke: black;} </style>

//<body onload='init()'>
//  <p> Rich test of new Branch </p>

//div class="1st Graph">
//  <h1 class="title">1st Graph</h1>

//<svg width=600 height=600>
//</svg>
var crime_dataObj;
var var_year = 2015;  // set a call to a subroutine and pass the year based on the selection???

d3.select('svg')
  .attr("width",800)
  .attr("height",600);

  d3.select('body')
  .append('div')
  .attr('id', 'tooltip')
  .attr('style', 'position:relative ; opacity:1;');

//<script>
async function init() {
//const data = await d3.csv("https://flunky.github.io/cars2017.csv");
//const data = await d3.csv("http://s3-us-gov-west-1.amazonaws.com/cg-d4b776d0-d898-4153-90c8-8336f86bdfec/estimated_crimes_1979_2018_rev1.csv");

const proxyurl = "https://cors-anywhere.herokuapp.com/";
const url = "http://s3-us-gov-west-1.amazonaws.com/cg-d4b776d0-d898-4153-90c8-8336f86bdfec/estimated_crimes_1979_2018_rev1.csv";
// const data = fetch(proxyurl + url)
// .then(response => response.text())
// //.then(contents => console.log(contents))
// .catch(() => console.log("Can’t access " + url + " response. Blocked by browser?"))

// const crime_data = d3.csv(proxyurl + url).then(function neededdata(data) {
//    console.log("this is the data columns");
//    console.log(+ data.columns);
//    console.log("this is the crime data");
//    console.log(data)
// });

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

// .then(function(data) {
//   data.forEach(function(d) {
//     d.population = +d.population;
//     d.aggravated_assault= +d.aggravated_assault;
//     d.burglary= +d.burglary;
//     d.homicide= +d.homicide;
//     d.larceny= +d.larceny;
//     d.motor_vehicle_theft= +d.motor_vehicle_theft;
//     d.property_crime= +d.property_crime;
//     d.rape_legacy= +d.rape_legacy;
//     d.rape_revised= +d.rape_revised;
//     d.robbery= +d.robbery;
//     d.violent_crime= +d.violent_crime;
//     d.comb_rape = +d.rape_legacy + d.rape_revised;
//     d.total_crime = +d.violent_crime + d.property_crime;
//     d.year = +d.year;
//   })
// })

//console.log(filtered);

// d3.csv(proxyurl + url)
// .then(function(data) {
//   data.forEach(function(d) {
//     d.population = +d.population;
//     d.aggravated_assault= +d.aggravated_assault;
//     d.burglary= +d.burglary;
//     d.homicide= +d.homicide;
//     d.larceny= +d.larceny;
//     d.motor_vehicle_theft= +d.motor_vehicle_theft;
//     d.property_crime= +d.property_crime;
//     d.rape_legacy= +d.rape_legacy;
//     d.rape_revised= +d.rape_revised;
//     d.robbery= +d.robbery;
//     d.violent_crime= +d.violent_crime;
//     d.comb_rape = +d.rape_legacy + d.rape_revised;
//     d.total_crime = +d.violent_crime + d.property_crime;
//     d.year = +d.year;})
//   });

  // console.log(cleaned);

//});

//var neededdata = d3.csv(proxyurl + url);
//console.log(neededdata);


// var neededdata = JSON.parse(crime_dataObj);
// console.log("test = " + neededdata.population);
//const data = await fetch("http://s3-us-gov-west-1.amazonaws.com/cg-d4b776d0-d898-4153-90c8-8336f86bdfec/estimated_crimes_1979_2018_rev1.csv", { mode: 'no-cors'});
//console.log(data);
// const data = await fetch("https://api.usa.gov/crime/fbi/sapi/api/estimates/national/2010/2018?API_KEY=GTdSSq8cUfFYoEHLlSiO3ehBk5TnZosaXv7BTJSR")
//  .then((response) => {
//      return response.json();
//    });
//   .then((data) => {
//     console.log(data);
//     var obj = JSON.parse(data);
//   });

//var obj = JSON.parse(data);//, function (key,value) { return value;})


//const data = response.text();
// let response = await fetch("https://api.usa.gov/crime/fbi/sapi/api/summarized/estimates/national/2010/2018?API_KEY=GTdSSq8cUfFYoEHLlSiO3ehBk5TnZosaXv7BTJSR");
// const data = await response.text();
//const data = await d3.csv("https://api.usa.gov/crime/fbi/sapi/api/summarized/state/NJ/violent-crime/2015/2018?API_KEY=GTdSSq8cUfFYoEHLlSiO3ehBk5TnZosaXv7BTJSR");

// var x = d3.scaleLog().domain([10,150]).range([0,500]);
// var y = d3.scaleLog().domain([10,150]).range([500,0]);

// const max = Math.max.apply(null,crime_dataObj.population);
// const min = Math.min.apply(null,crime_dataObj.population);
// console.log("min = " + min);
// console.log("max = " + max);
// console.log("test pop = " + crime_dataObj.population)
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
const width = ( 800 );
const radplus = ( 2 );

var x = d3.scaleLog().domain([xlengthmin,xlength]).range([0,width]);  //500
var y = d3.scaleLog().domain([ylengthmin,ylength]).range([height,0]);  //500

// var coordinates = d3.mouse(this);
// var xm = coordinates[0];
// var ym = coordinates[1];

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
//    .filter(function(data) { return data.state_abbr != "" })
//    .filter(function(data) { return data.year == var_year})
	  .append('circle')
	    .attr('cx',function(data) {return xs(data.total_crime);}) //xsdata.total_crime;; function(d) { return d.total_crime;}
	    .attr('cy',function(data) {return ys(data.population);})  //ys population
	    .attr('r',function(data,i) {return +radplus + +5;})
      // .attr('cx',function(d) {return xs(d.AverageCityMPG);})
      // .attr('cy',function(d) {return ys(d.AverageHighwayMPG);})
      // .attr('r',function(d) {return +radplus + +d.EngineCylinders;})
    .on("mouseover", function(d){
      d3.select(this).raise()
      d3.select(this.parentNode)
        .append("text")
        .attr("class", "car")
        .attr('x',function () { return d3.mouse(this)[0];})
        .attr('y',function () { return d3.mouse(this)[1];})
        .text(d.year + ": Total Crime = " + d.total_crime + " in " + d.state_abbr)
    //    .text(d.Make)
    // console.log(d.state_abbr);
    })
    .on("mouseout", function(d){
      d3.selectAll("text.car").remove()
      d3.select(this).lower();
    })

d3.select("svg").append("g")
    .attr("transform","translate("+ margin +","+ margin +")")
    .call(yAxis);

d3.select("svg").append("text")
     .attr("class","yaxislab")
     .attr("transform","translate("+ (margin - 40) +","+ (margin + (height / 2)) +") rotate(270)")
     // .attr("dx", (margin-40))
     // .attr("dy", (margin + (height / 2)))
     // .attr("transform", "rotate(270)")
     .text("Population");

 d3.select("svg").append("g")
    .attr("transform","translate("+ margin +","+(height + margin)+")")
    .call(xAxis);

 d3.select("svg").append("text")
    .attr("class","xaxislab")
    .attr("transform","translate("+ (margin + (width / 2))+","+(height + margin + 30)+")")
    // .attr("transform","translate("+ margin +(width / 2)+",+(height + margin)+")")
    .text("Total Crime");
  };

  init();
