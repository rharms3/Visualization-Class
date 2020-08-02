// Index-st.js - used for the State view of the data
var fill_plot_st_detail = function(data, year, state) {  //build the plot

 // if (state != "All") {
  var xlength = d3.max(data, function(d) { if (d.statename == state) {return d.total_crime};});
  var ylength = d3.max(data, function(d) { if (d.statename == state) {return d.population};});
  var xlengthmin = d3.min(data, function(d) { if (d.statename == state) {return d.total_crime};});
  var ylengthmin = d3.min(data, function(d) { if (d.statename == state) {return d.population};});
  //   }
  // else {
  //   var xlength = d3.max(data, function(d) { return d.total_crime;});
  //   var ylength = d3.max(data, function(d) { return d.population;});
  //   var xlengthmin = d3.min(data, function(d) { return d.total_crime;});
  //   var ylengthmin = d3.min(data, function(d) { return d.population;});
  //   }

    const margin = ( 50 );
    const height = ( 500 );//500
    const width = ( 700 ); //700
    const radplus = ( 2 );

    var x = d3.scaleLinear().domain([xlengthmin,xlength]).range([0,width]);
    var y = d3.scaleLinear().domain([ylengthmin,ylength]).range([height,0]);

    var xAxis = d3.axisBottom(x);
  //    .tickValues([(xlength*.01),(xlength*.025),(xlength*.10),(xlength*.25),(xlength*.5),(xlength*.75),xlength])
  //  .tickFormat(d3.format(".0s"));

    var yAxis = d3.axisLeft(y)
      .tickFormat(d3.format(".3s"));

    xdomain = [xlengthmin,xlength];
    xrange = [0,width];
    ydomain = [ylengthmin,ylength];
    yrange = [height,0];

    xs = d3.scaleLinear().domain(xdomain).range(xrange);
    ys = d3.scaleLinear().domain(ydomain).range(yrange);


  state = state.trim();

    d3.select("svg2")
    .attr("width",width + margin + margin)
    .attr("height",height + margin + margin)
    .append("g")
      .attr("transform","translate("+ margin +","+ margin +")")
    .selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
      .filter(function(data) {return data.statename == state & data.year == year;})
      .transition()
      .delay(function(d,i){return(i*3)})
      .duration(2000)
      .attr("fill","red")
      .attr('cx',function(data) {return xs(data.total_crime);})
      .attr('cy',function(data) {return ys(data.population);})
      .attr('r',function(data,i) {return +radplus + +5;});

    // d3.select("svg2")
    //     .append('g')
    //       .attr("transform","translate("+ margin +","+ margin +")")
    //     .selectAll("text")
    //     .data(data)
    //     .enter()
    //     .append("text")
    //       .filter(function(data) {return data.statename == state;})
    //       .transition()
    //       .delay(function(d,i){return(i*3)})
    //       .duration(3000)
    //       .attr("class","statetext")
    //       .attr('x',function(data) {return (xs(data.total_crime) + 8);})
    //       .attr('y',function(data) {return (ys(data.population) +2);})
    //       .text(function(data) {return data.year;});

    d3.selectAll('circle')
    .on("mouseover", function(d){
      //Get this circles's x/y values, then augment for the tooltip
      var xPosition = parseFloat(d3.mouse(this)[0]+200);// + 88;
      var yPosition = parseFloat(d3.mouse(this)[1]+115);//+70;// - 29;

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
      d3.selectAll("svg2").remove();
      svg2 = d3.select("#nd-box").append("svg2"); //selectAll("bod")
      var tooltipDiv = document.getElementById('tooltip');
      tooltipDiv.style.display = "none";
      fill_plot_st(data,state);  // not use new year but open new graph i think
        })

    d3.select("svg2").append("g")
    .attr("transform","translate("+(margin + 10)+","+ margin +")")
    .call(yAxis);

    d3.select("svg2").append("text")
    .attr("class","yaxislab")
    .attr("transform","translate("+ (margin - 35) +","+ (margin + (height / 2)) +") rotate(270)")
    .text("Population");

    d3.select("svg2").append("g")
    .attr("transform","translate("+(margin + 10)+","+(height + margin)+")")
    .call(xAxis);

    d3.select("svg2").append("text")
    .attr("class","xaxislab")
    .attr("transform","translate("+ (margin + (width / 2))+","+(height + margin + 40)+")")
    .text("Total Crime");
  };
