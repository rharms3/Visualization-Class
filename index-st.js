// Index-st.js - used for the State view of the data
var fill_plot_st = function(data, state) {  //build the plot

// if (state != "All") {
  var xlength = d3.max(data, function(d) { if (d.statename == state) {return d.total_crime};});
  var ylength = d3.max(data, function(d) { if (d.statename == state) {return d.population};});
  var xlengthmin = d3.min(data, function(d) { if (d.statename == state) {return d.total_crime};});
  var ylengthmin = d3.min(data, function(d) { if (d.statename == state) {return d.population};});
  //  }
  // else {
  //   var xlength = d3.max(data, function(d) { return d.total_crime;});
  //   var ylength = d3.max(data, function(d) { return d.population;});
  //   var xlengthmin = d3.min(data, function(d) { return d.total_crime;});
  //   var ylengthmin = d3.min(data, function(d) { return d.population;});
  //   }

    const margin = ( 50 );
    const height = ( 400 );
    const width = ( 600 );
    const radplus = ( 2 );

    d3.selectAll("#mainchart").select("svg").remove();
    d3.selectAll("#mainchartst").select("svg").remove();
    var chart2 = d3.select("#mainchartst")
    .append("svg")
    .attr("width",(width + (margin * 2)))
    .attr("height",(height + (margin * 3)));

    var x = d3.scaleLinear().domain([xlengthmin,xlength]).range([0,width]);
    var y = d3.scaleLinear().domain([ylengthmin,ylength]).range([height,0]);

    var xAxis = d3.axisBottom(x)
  //    .tickValues([(xlength*.01),(xlength*.025),(xlength*.10),(xlength*.25),(xlength*.5),(xlength*.75),xlength])
    .tickFormat(d3.format(".3s"));

    var yAxis = d3.axisLeft(y)
      .tickFormat(d3.format(".3s"));

    xdomain = [xlengthmin,xlength];
    xrange = [0,width];
    ydomain = [ylengthmin,ylength];
    yrange = [height,0];

    xs = d3.scaleLinear().domain(xdomain).range(xrange);
    ys = d3.scaleLinear().domain(ydomain).range(yrange);

    chart2.append("g")//d3.select("svg")
    .attr("width",width + margin + margin)
    .attr("height",height + margin + margin)
  //  .append("g")
      .attr("transform","translate("+ (margin +10) +","+ margin +")")
    .selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
      .filter(function(data) {if (state == "All"){ return data.statename >= "A"} else {return data.statename == state;}}) //"Select a Year", min_year
      .transition()
      .delay(function(d,i){return(i*3)})
      .duration(2000)
      .attr('cx',function(data) {return xs(data.total_crime);})
      .attr('cy',function(data) {return ys(data.population);})
      .attr('r',function(data,i) {return +radplus + +5;});

    chart2.append('g')//d3.select("svg")
          .attr("transform","translate("+ (margin+10) +","+ margin +")")
        .selectAll("text")
        .data(data)
        .enter()
        .append("text")
          .filter(function(data) {if (state == "All"){ return data.statename >= "A"} else {return data.statename == state;}})
          .transition()
          .delay(function(d,i){return(i*3)})
          .duration(3000)
          .attr("class","statetext")
          .attr('x',function(data) {return (xs(data.total_crime) + 8);})
          .attr('y',function(data) {return (ys(data.population) +2);})
          .text(function(data) {return data.year;});

    d3.selectAll('circle')
    .on("mouseover", function(d){
      //Get this circles's x/y values, then augment for the tooltip
      var xPosition = parseFloat(d3.mouse(this)[0]+200);// + 88;
      var yPosition = parseFloat(d3.mouse(this)[1]+115);//+70;// - 29;
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
      // d3.selectAll("#mainchart").select("svg").remove();
      // d3.selectAll("#smainchartst").select("svg").remove();
      d3.selectAll("#subchart").select("svg").remove();
      chart3 = d3.select("#subchart").append("svg"); //selectAll("bod")
      var tooltipDiv = document.getElementById('tooltip');
      tooltipDiv.style.display = "none";
      newyear = d.year; //data.year; //"All";
      newstate = d.state_abbr
      newstatename = d.statename;
      fill_plot_st_detail_working(data,newyear,newstate,newstatename); //fill_plot_st(data,state);  // not use new year but open new graph i think
        })

    chart2.append("g")//d3.select("svg").append("g")
    .attr("transform","translate("+(margin + 10)+","+ margin +")")
    .call(yAxis).selectAll('text');

    chart2.append("text")//d3.select("svg").append("text")
    .attr("class","yaxislab")
    .attr("transform","translate("+ (margin - 35) +","+ (margin + (height / 2)) +") rotate(270)")
    .text("Population");

    chart2.append("g")//d3.select("svg").append("g")
    .attr("transform","translate("+(margin + 10)+","+(height + margin)+")")
    .call(xAxis).selectAll('text')
      .style('text-anchor', 'end')
      .style('font-size', '12px')
      .attr('transform', 'rotate(-45) translate(-10, -5)');

    chart2.append("text")//d3.select("svg").append("text")
    .attr("class","xaxislab")
    .attr("transform","translate("+ (margin + (width / 2))+","+(height + margin + 55)+")")
    .text("Total Crime");

    chart2.append("text")//d3.select("svg").append("text")
    .attr("class","xaxislab")
    .data(data)
    .attr("transform","translate("+ ((margin))+","+(25)+")")
    .text(function(data) {if (state != '') {return "Total Crimes for the State of " + state + " by Year"};})//"Breakdown of Total Crimes per State Per Year")
    .selectAll('text')
    .style('text-anchor', 'end')
    .style('font-size', '14px');


//  annotation configuration below

    chart2.append('rect')
    .attr("transform","translate("+ ((margin + 415 ))+","+(35)+")")
    .attr("class", function() {if (state != '') {return "scannot1d"} else {return "scannot1" };})
    .attr("width", 215)
    .attr("height", 50)
    .style("stroke","black")
    .style('corners','round')
    .style("fill", "yellow");

    chart2.append('text')
    .attr("class",function() {if (state != '') {return "scannot1d"} else {return "scannot1" };})
    .attr("transform","translate("+ ((margin + 420 ))+","+(50)+")")
    .attr("width",210)
    .text("Some states show decrease over ")
    .append('text')
    .text("time while others fluctuate year to year");

    chart2.append('text')
    .attr("class",function() {if (state != '') {return "scannot1d"} else {return "scannot1" };})
    .attr("transform","translate("+ ((margin + 420 ))+","+(65)+")")
    .attr("width",210)
    .text("time while others fluctuate year to");

    chart2.append('text')
    .attr("class",function() {if (state != '') {return "scannot1d"} else {return "scannot1" };})
    .attr("transform","translate("+ ((margin + 420 ))+","+(80)+")")
    .attr("width",210)
    .text("year.");

  };
