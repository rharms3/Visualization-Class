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

      fill_plot(data,year);
};

  init();
