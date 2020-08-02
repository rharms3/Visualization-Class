var crime_dataObj;
var state_names;
var var_year;
var init_var_year;  // set a call to a subroutine and pass the year based on the selection???
var initvar; // set initial fill for year as all
var fitlered;
var initfiltered;

var svg = d3.select('svg')
  .attr("width",800)
  .attr("height",600);

  var div = d3.select('body')
  .append('div')
  .attr('id', 'tooltip')
  .attr('style', 'position:relative ; opacity:1;');

//<script>
async function init(var_year,initvar) {

  //load_data(crime_dataObj,state_names);
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const crimeurl = "http://s3-us-gov-west-1.amazonaws.com/cg-d4b776d0-d898-4153-90c8-8336f86bdfec/estimated_crimes_1979_2018_rev1.csv";
    const stateurl = "http://www.fonz.net/blog/wp-content/uploads/2008/04/states.csv"

    //load csv and copy to global variable
    const crime_dataObj = await d3.csv(proxyurl + crimeurl);
    const state_names = await d3.csv(proxyurl + stateurl, function(d) {
      return {
        Abbreviation:d.Abbreviation,
        State:d.State
      };
    });

    filtered = crime_dataObj.filter(function(data) {
      if (initvar == 1) {return (data.state_abbr != "" )}//& data.year >= init_var_year)}// all years first
      else {return (data.state_abbr != "" & data.year == var_year)}; // send only 1 selected year
    })

    if (initvar == 1) {initfiltered = filtered};

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
        const test = state_names.filter(function (e){
          return e.Abbreviation == d.state_abbr;})
          d.statename = test[0].State;
      })

  // Handler for dropdown value change
               var dropdownChange = function() {
                 d3.selectAll("svg").remove();
                 svg = d3.selectAll("body").append("svg");
                 var newyear = d3.select(this).property('value');
                 if (newyear == "Select a Year"){initvar = 1}
                 else { initvar = 0};
                 init(newyear,initvar);
               };

               var dropdown = d3.select("#vis-container")
                   .insert("select", "svg")
                   .on("change", dropdownChange);

               var nest = d3.nest()
                .key(function(initfiltered) { return initfiltered.year;})
                .entries(initfiltered);

                nest.unshift({key: "Select a Year", values: Array(50)});

               dropdown.selectAll("option")
                   .data(nest)
                  .enter().append("option")
                   .attr("value", function (data) { return data.key; })
                   .text(function (data) {
                       return data.key;
             });


var xlength = d3.max(filtered, function(d) { return d.total_crime;});
var ylength = d3.max(filtered, function(d) { return d.population;});
var xlengthmin = d3.min(filtered, function(d) { return d.total_crime;});
var ylengthmin = d3.min(filtered, function(d) { return d.population;});

const margin = ( 50 );
const height = ( 500 );
const width = ( 600 );
const radplus = ( 2 );

var x = d3.scaleLog().domain([xlengthmin,xlength]).range([0,width]);
var y = d3.scaleLog().domain([ylengthmin,ylength]).range([height,0]);

var xAxis = d3.axisBottom(x)
        .tickValues([(xlength*.01),(xlength*.025),(xlength*.10),(xlength*.25),(xlength*.5),(xlength*.75),xlength])
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

  d3.select("svg")
    .attr("width",width + margin + margin)
    .attr("height",height + margin + margin)
    .append("g")
        .attr("transform","translate("+ margin +","+ margin +")")
    .selectAll('circle')
	  .data(filtered)
  //  .filter()
	  .enter()
	  .append('circle')
      .transition()
      .delay(function(d,i){return(i*3)})
      .duration(2000)
	    .attr('cx',function(data) {return xs(data.total_crime);})
	    .attr('cy',function(data) {return ys(data.population);})
	    .attr('r',function(data,i) {return +radplus + +5;});

    d3.selectAll('circle')
     .on("mouseover", function(d){
       //Get this bar's x/y values, then augment for the tooltip
        var xPosition = parseFloat(d3.mouse(this)[0]);// + 88;
        var yPosition = parseFloat(d3.mouse(this)[1]+100);//+70;// - 29;
           current_position = d3.mouse(this);
           const formater = d3.format(',d');
           var tooltipDiv = document.getElementById('tooltip');
           tooltipDiv.innerHTML = d.statename + " ("+ d.state_abbr + ") " + "<br/>" + "Year = " +d.year + "<br/>" + "Population = "
                                  + formater(d.population) + "<br/>" + "Total Crime = " + formater(d.total_crime);
           tooltipDiv.style.top = yPosition + "px"; //current_position[1];
           tooltipDiv.style.left = xPosition + "px"; //current_position[0];
           tooltipDiv.style.display = "block";

           d3.select(this).style("fill", "red")
           .raise();
    })

     .on("mouseout", function(d){
       d3.select(this).style("fill", "lightblue").lower();
         var tooltipDiv = document.getElementById('tooltip');
         tooltipDiv.style.display = "none";
    })

     .on("click", function(d){
       d3.selectAll("svg").remove();
       svg = d3.selectAll("body").append("svg");
      // d3.select("#vis-container").();
       var tooltipDiv = document.getElementById('tooltip');
       tooltipDiv.style.display = "none";
       init(var_year, 1);
    })

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

  init(init_var_year, 1);
