// Index-st.js - used for the State view of the data
var fill_plot_st_detail_working = function(data, year, state, statename) {  //build the plot

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
          total_crime: d.total_crime,
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

    d3.selectAll("#subchart").select("svg").remove();
    var chart3 = d3.select("#subchart")
      .append("svg")
      .attr("width",(width + (margin * 2)))
      .attr("height",(height + (margin * 3) + 25));

    var ylength = d3.max(data, function(data) {if (data.state_abbr == state && data.year == year){ return data.number};});
    var nest_band = d3.nest().key(function(data) { return data.crime_type;}).entries(data);

    var yScale = d3.scaleLinear().domain([0,ylength]).range([height,0]);
    var xScale = d3.scaleBand().domain(nest_band.map(d => d.key)).range([0,width]).padding(0.1);//function(data) {return data.key})

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

      chart3.append("text") //d3.select("svg").append("text")
      .attr("class","yaxislab")
      .attr("transform","translate("+ (margin - 30) +","+ ((height / 2)+(margin *2) + 25) +") rotate(270)")
      .text("Number of Incidents");

      chart3.append("g") //d3.select("svg").append("g")
      .attr("transform","translate("+(margin + 10)+","+(height + margin - 10)+")")
      .call(xAxis)
      .selectAll('text')
        .style('text-anchor', 'end')
        .style('font-size', '12px')
        .attr('transform', 'rotate(-45) translate(-10, -5)');

      chart3.append("text") //d3.select("svg").append("text")
      .attr("class","xaxislab")
      .attr("transform","translate("+ ((margin * 2) + (width / 2))+","+(height + margin + 105)+")")
      .style('text-anchor', 'end')
      .text("Types of Crime");

//title
      chart3.append("text")
      .attr("class","stdethd")
      .data(data)
      .attr("transform","translate("+ 10 +","+20+")") // + (width / 2) with margin
      .text("Types of crime for " + statename + " in " + year);//}, "(", state,")","     ",year);

// restict the bigger set to a smaller temp set for the plot
     barfiltered = data.filter(function(data) {return data.state_abbr == state & data.year == year});

     chart3.append("g") //d3.select("svg")
      .attr("transform","translate("+ (margin+10) +","+ (margin -10)+")")
      .selectAll("rect")
      .data(barfiltered)
      .enter()
      .append("rect")
      .transition()
      .delay(function(d,i){return(i*3)})
      .duration(2000)
      .attr("fill","lightblue")
      .attr("stroke","black")
       .attr("x", function(data) { return xScale(data.crime_type);})
       .attr("y", function(data) { return yScale(data.number);})
       .attr("width", xScale.bandwidth())//(50 - padding))
       .attr("height", function(data) {return height - yScale(data.number);});

    d3.selectAll('rect')
    .on("mouseover", function(d){
      //Get this circles's x/y values, then augment for the tooltip
      // var xPosition = parseFloat(d3.mouse(this)[0]+1200);// + 88;
      // var yPosition = parseFloat(d3.mouse(this)[1]+110);//+70;// - 29;
      var xPosition = d3.event.pageX + 10;// + 88;
      var yPosition = d3.event.pageY + 10;//+70;// - 29;
current_position = d3.mouse(this);
      const formater = d3.format(',d');
      const performater = d3.format('.2%')
      var tooltipDivst = document.getElementById('tooltipst');
      tooltipDivst.innerHTML = d.crime_type.charAt(0).toUpperCase() + d.crime_type.slice(1).replace(/_/g," ") + " = " + formater(d.number) + "<br/>"
      + "Percent of Total = " + performater((d.number / d.total_crime));
      tooltipDivst.style.top = yPosition + "px"; //current_position[1]; yPosition + "px"
      tooltipDivst.style.left = xPosition + "px"; //current_position[0]; xPosition + "px"
      tooltipDivst.style.display = "block";
      tooltipDivst.style.height = 35 +"px";

      d3.select(this).style("fill", "red")
      .raise();
    })

    .on("mouseout", function(d){
      d3.select(this).style("fill", "lightblue").lower();
      var tooltipDivst = document.getElementById('tooltipst');
      tooltipDivst.style.display = "none";
    })
  };
