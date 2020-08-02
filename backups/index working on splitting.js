var crime_dataObj;
var state_names;
var var_year;
var init_var_year = "All";  // "Select a Year" set a call to a subroutine and pass the year based on the selection???
var fitlered;

  var svg = d3.select('svg')
   .attr("width",700)
   .attr("height",500);

  var svg2 = d3.select('svg2')
  .attr("width",700)
  .attr("height",500);

  var div = d3.select('body')
  .append('div')
  .attr('id', 'tooltip')
  .attr('style', 'position:relative ; opacity:1;');

//<script>
async function init() {

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

    filtered = crime_dataObj.filter(function(data) {return data.state_abbr != "" & data.year >=1998});

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
        d.rape = +d.rape_legacy + d.rape_revised;
        d.total_crime = +d.violent_crime + d.property_crime;
        d.year = +d.year;
        const test = state_names.filter(function (e){
          return e.Abbreviation == d.state_abbr;})
          d.statename = test[0].State;
      })

    set_data(filtered,init_var_year);
} //end init function

// set function break for init and refresh of the data

var set_data = function(data, year) {

  // Handler for dropdown value change on Year
     var dropdownChange = function() {
       d3.selectAll("#mainchartst").select("svg").remove();
       d3.selectAll("#mainchart").select("svg").remove();
       d3.selectAll("#subchart").select("svg").remove();
       var chart1 = d3.select("#mainchart").append("svg");  //selectAll("body")
       var newyear = d3.select(this).property('value');
       fill_plot(data,newyear);
     };

     var dropdown = d3.select("#vis-container")
         .insert("select", "svg")
         .on("change", dropdownChange);

     var nest = d3.nest()
      .key(function(data) { return data.year;})
      .entries(data);

      nest.unshift({key: "All", values: Array(50)});

     dropdown.selectAll("option")
         .data(nest)
         .enter().append("option")
         .attr("value", function (data) { return data.key; })
         .text(function (data) {
             return data.key;
      });  // Year dropdown end

      // Handler for dropdown value change on State
         var dropdownChangeSt = function() {
           d3.selectAll("#mainchartst").select("svg").remove();
           d3.selectAll("#mainchart").select("svg").remove();
           d3.selectAll("#subchart").select("svg").remove();
           var chart2 = d3.select("#mainchartst").append("svg");//selectAll("body")
           var newstate = d3.select(this).property('value');
           fill_plot_st(data,newstate)
         };

         var dropdown = d3.select("#vis-container-state")
             .insert("select", "svg")
             .on("change", dropdownChangeSt);

         var nest_st = d3.nest()
          .key(function(data) { return data.statename;})
          .entries(data);

          nest_st.unshift({key: "", values: Array(50)});

         dropdown.selectAll("option")
             .data(nest_st)
             .enter().append("option")
             .attr("value", function (data) { return data.key; })
             .text(function (data) {
                 return data.key;
          });  // state dropdown end

    // var fill_plot = function(data, year) {  //build the plot
    //
    //     var xlength = d3.max(data, function(d) { return d.total_crime;});
    //     var ylength = d3.max(data, function(d) { return d.population;});
    //     var xlengthmin = d3.min(data, function(d) { return d.total_crime;});
    //     var ylengthmin = d3.min(data, function(d) { return d.population;});
    //
    //     const margin = ( 50 );
    //     const height = ( 500 );
    //     const width = ( 700 );
    //     const radplus = ( 2 );
    //
    //     var x = d3.scaleLog().domain([xlengthmin,xlength]).range([0,width]);
    //     var y = d3.scaleLog().domain([ylengthmin,ylength]).range([height,0]);
    //
    //     var xAxis = d3.axisBottom(x)
    //     .tickValues([(xlength*.01),(xlength*.025),(xlength*.10),(xlength*.25),(xlength*.5),(xlength*.75),xlength])
    //     .tickFormat(d3.format(".0s"));
    //
    //     var yAxis = d3.axisLeft(y)
    //       .tickFormat(d3.format(".0s"));
    //
    //     xdomain = [xlengthmin,xlength];
    //     xrange = [0,width];
    //     ydomain = [ylengthmin,ylength];
    //     yrange = [height,0];
    //
    //     xs = d3.scaleLog().domain(xdomain).range(xrange);
    //     ys = d3.scaleLog().domain(ydomain).range(yrange);
    //
    //     min_year = d3.min(data, function(data) {return data.year;});
    //
    //     d3.select("svg")
    //     .attr("width",width + margin + margin)
    //     .attr("height",height + margin + margin)
    //     .append("g")
    //     .attr("transform","translate("+ margin +","+ margin +")")
    //     .selectAll('circle')
    //     .data(data)
    //     .enter()
    //     .append('circle')
    //     .filter(function(data) {if (year == "All"){ return data.year >= 1998} else {return data.year == year;}}) //"Select a Year", min_year
    //     .transition()
    //     .delay(function(d,i){return(i*3)})
    //     .duration(2000)
    //     .attr('cx',function(data) {return xs(data.total_crime);})
    //     .attr('cy',function(data) {return ys(data.population);})
    //     .attr('r',function(data,i) {return +radplus + +5;});
    //
    //     d3.selectAll('circle')
    //     .on("mouseover", function(d){
    //       //Get this circle's x/y values, then augment for the tooltip
    //       var xPosition = parseFloat(d3.mouse(this)[0]);// + 88;
    //       var yPosition = parseFloat(d3.mouse(this)[1]+100);//+70;// - 29;
    //       current_position = d3.mouse(this);
    //       const formater = d3.format(',d');
    //       var tooltipDiv = document.getElementById('tooltip');
    //       tooltipDiv.innerHTML = d.statename + " ("+ d.state_abbr + ") " + "<br/>" + "Year = " +d.year + "<br/>" + "Population = "
    //       + formater(d.population) + "<br/>" + "Total Crime = " + formater(d.total_crime);
    //       tooltipDiv.style.top = yPosition + "px"; //current_position[1];
    //       tooltipDiv.style.left = xPosition + "px"; //current_position[0];
    //       tooltipDiv.style.display = "block";
    //
    //       d3.select(this).style("fill", "red")
    //       .raise();
    //     })
    //
    //     .on("mouseout", function(d){
    //       d3.select(this).style("fill", "lightblue").lower();
    //       var tooltipDiv = document.getElementById('tooltip');
    //       tooltipDiv.style.display = "none";
    //     })
    //
    //     .on("click", function(d){
    //       d3.selectAll("svg").remove();
    //       svg = d3.selectAll("body").append("svg");
    //       var tooltipDiv = document.getElementById('tooltip');
    //       tooltipDiv.style.display = "none";
    //       newyear = "All";
    //       fill_plot(data,newyear);  // not use new year but open new graph i think
    //     })
    //
    //     d3.select("svg").append("g")
    //     .attr("transform","translate("+ margin +","+ margin +")")
    //     .call(yAxis);
    //
    //     d3.select("svg").append("text")
    //     .attr("class","yaxislab")
    //     .attr("transform","translate("+ (margin - 40) +","+ (margin + (height / 2)) +") rotate(270)")
    //     .text("Population");
    //
    //     d3.select("svg").append("g")
    //     .attr("transform","translate("+ margin +","+(height + margin)+")")
    //     .call(xAxis);
    //
    //     d3.select("svg").append("text")
    //     .attr("class","xaxislab")
    //     .attr("transform","translate("+ (margin + (width / 2))+","+(height + margin + 30)+")")
    //     .text("Total Crime");
    //  };

      fill_plot(data,year);

};
//}  // send set_data function

  init();
