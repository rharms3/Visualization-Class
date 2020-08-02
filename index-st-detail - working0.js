// Index-st.js - used for the State view of the data
var fill_plot_st_detail_working = function(data, year, state) {  //build the plot

var structuredData = transformData(data);

function transformData(dataset) {
  var newData = [];

  data.forEach(function(d) {
    for (key in d) {
      if (key !== 'year' && key !== 'state_abbr' && key !== 'statename' && key !== 'population' &&
         key !== 'violent_crime' && key !== 'property_crime' && key !== 'rape_legacy' && key !== 'rape_revised' &&
         key !== 'caveats' && key !== 'total_crime' && newData.indexOf(key) === -1) {
        newData.push({
          year: d.year,
          state_abbr: d.state_abbr,
          statename: d.statename,
          population: d.population,
          crime_type: key,
          number: d[key]
        });
      }
    }
  });

  return newData;
}

  data = structuredData;

    const margin = ( 50 );
    const height = ( 300 );//500
    const width = ( 300 ); //700
    const padding = ( 5 );

    var chart3 = d3.select("#subchart")
      .attr("width",(width + (margin * 2)))
      .attr("height",(height + (margin * 3)));

    var ylength = d3.max(data, function(data) {if (data.state_abbr == state && data.year == year){ return data.number};});
    var nest_band = d3.nest().key(function(data) { return data.crime_type;}).entries(data);

    var yScale = d3.scaleLinear().range([height,0]).domain([0,ylength]);
    var xScale = d3.scaleBand().domain(nest_band.map(function(data) {return data.key})).range([0,width]).padding(0.1);

  //  xScale.domain(data.map(function(data) {return data.crime_type;}));//{ if (data.state_abbr == state && data.year == year) {return data.crime_type}; }));
  //  yScale.domain(d3.extent(data, function(data){if (data.state_abbr == state && data.year == year) {return data.number}; }));

    var yAxis = d3.axisLeft(yScale)
      .tickFormat(d3.format(".3s"));

    var xAxis = d3.axisBottom(xScale);
      //    .tickValues([(xlength*.01),(xlength*.025),(xlength*.10),(xlength*.25),(xlength*.5),(xlength*.75),xlength])
      //  .tickFormat(d3.format(".0s"));

      chart3.append("g") //d3.select("svg").append("g")
      .attr("transform","translate("+(margin + 10)+","+ (margin-10) +")")
      .call(yAxis);

      chart3.append("g") //d3.select("svg").append("text")
      .attr("class","yaxislab")
      .attr("transform","translate("+ (margin - 30) +","+ ((height / 2)+(margin *2)) +") rotate(270)")
      .text("Number of Incidents");

      chart3.append("g") //d3.select("svg").append("g")
      .attr("transform","translate("+(margin + 10)+","+(height + margin - 10)+")")
      .call(xAxis)
      .selectAll('text')
        .style('text-anchor', 'end')
        .style('font-size', '12px')
        .attr('transform', 'rotate(-45) translate(-10, -5)');;

      chart3.append("g") //d3.select("svg").append("text")
      .attr("class","xaxislab")
      .attr("transform","translate("+ ((margin * 2) + (width / 2))+","+(height + margin + 95)+")")
      .style('text-anchor', 'end')
      .text("Types of Crime");

     chart3.append("g") //d3.select("svg")
      // .attr("width",width + margin + margin)
      // .attr("height",height + margin + margin)
    // .append("g")
       .attr("transform","translate("+ 20 +","+ (margin -10)+")")
     .selectAll("rect")
     .data(data)
     .enter()
     .append("rect")
      .filter(function(data) {return data.state_abbr == state & data.year == year;})
      .transition()
      .delay(function(d,i){return(i*3)})
      .duration(2000)
      .attr("fill","lightblue")
      .attr("stroke","black")
       .attr("x", function(data) { return xScale(function(data,i) {if (data.state_abbr == state && data.year == year){ return data.crime_type};}) })
       .attr("y", function(data) { return yScale(function(data) {if (data.state_abbr == state && data.year == year){ return data.number};}) })
       .attr("width", xScale.bandwidth())//(50 - padding))
       .attr("transform",function(data,i) { var xcoord = (width/7) * (i+1); return "translate("+ xcoord +")";})//return "translate("+ xScale(data.crime_type) +")";})
       .attr("height", function(data) {return height - yScale(data.number);});//(height - 250));//yScale(function(data) { return data.number;}));//(height - 250));

    d3.selectAll('rect')
    .on("mouseover", function(d){
      //Get this circles's x/y values, then augment for the tooltip
      var xPosition = parseFloat(d3.mouse(this)[0]);// + 88;
      var yPosition = parseFloat(d3.mouse(this)[1]);//+70;// - 29;

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

    // .on("click", function(d){
    //   d3.selectAll("svg2").remove();
    //   svg2 = d3.select("#nd-box").append("svg2"); //selectAll("bod")
    //   var tooltipDiv = document.getElementById('tooltip');
    //   tooltipDiv.style.display = "none";
    //   fill_plot_st(data,state);  // not use new year but open new graph i think
    //     })


  };
