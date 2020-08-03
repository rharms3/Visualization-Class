// Index-st.js - used for the Year view of the data
var fill_plot = function(data, year) {  //build the plot

    var xlength = d3.max(data, function(d) { return d.total_crime;});
    var ylength = d3.max(data, function(d) { return d.population;});
    var xlengthmin = d3.min(data, function(d) { return d.total_crime;});
    var ylengthmin = d3.min(data, function(d) { return d.population;});

    const margin = ( 50 );
    const height = ( 400 );
    const width = ( 600 );
    const radplus = ( 2 );

    d3.selectAll("#mainchartst").select("svg").remove();
    d3.selectAll("#mainchart").select("svg").remove();
    var chart1 = d3.select("#mainchart")
    .append("svg")
    .attr("width",(width + (margin * 2)))
    .attr("height",(height + (margin * 3)));

    var x = d3.scaleLog().domain([xlengthmin,xlength]).range([0,width]);
    var y = d3.scaleLog().domain([ylengthmin,ylength]).range([height,0]);

    var xAxis = d3.axisBottom(x)
//    .tickValues([(xlength*.01),(xlength*.025),(xlength*.10),(xlength*.25),(xlength*.5),(xlength*.75),xlength])
    .tickFormat(d3.format(".0s"));

    var yAxis = d3.axisLeft(y)
      .tickFormat(d3.format(".0s"));

    xdomain = [xlengthmin,xlength];
    xrange = [0,width];
    ydomain = [ylengthmin,ylength];
    yrange = [height,0];

    xs = d3.scaleLog().domain(xdomain).range(xrange);
    ys = d3.scaleLog().domain(ydomain).range(yrange);

    min_year = d3.min(data, function(data) {return data.year;});

    chart1.append("g")//d3.select("svg")
    .attr("width",width + margin + margin)
    .attr("height",height + margin + margin)
  //  .append("g")
    .attr("transform","translate("+ margin +","+ margin +")")
    .selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .filter(function(data) {if (year == "All"){ return data.year >= 1998} else {return data.year == year;}}) //"Select a Year", min_year
    .transition()
    .delay(function(d,i){return(i*3)})
    .duration(2000)
    .attr('cx',function(data) {return xs(data.total_crime);})
    .attr('cy',function(data) {return ys(data.population);})
    .attr('r',function(data,i) {return +radplus + +5;});

    d3.selectAll('circle')
    .on("mouseover", function(d){
      //Get this circle's x/y values, then augment for the tooltip
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
      d3.selectAll("#subchart").select("svg").remove();
      var chart3 = d3.select("#subchart").append("svg"); //selectAll("body")
      var tooltipDiv = document.getElementById('tooltip');
      tooltipDiv.style.display = "none";
      newyear = d.year; //data.year; //"All";
      newstate = d.state_abbr
      newstatename = d.statename;
      fill_plot_st_detail_working(data,newyear,newstate,newstatename);  // not use new year but open new graph i think
    })

    chart1.append("g")//d3.select("svg").append("g")
    .attr("transform","translate("+ margin +","+ margin +")")
    .call(yAxis).selectAll('text');

    chart1.append("text")//d3.select("svg").append("text")
    .attr("class","yaxislab")
    .attr("transform","translate("+ (margin - 35) +","+ (margin + (height / 2)) +") rotate(270)")
    .text("Population");

    chart1.append("g")//d3.select("svg").append("g")
    .attr("transform","translate("+ margin +","+(height + margin)+")")
    .call(xAxis)
    .selectAll('text')
      .style('text-anchor', 'end')
      .style('font-size', '12px')
      .attr('transform', 'rotate(-45) translate(-10, -5)');

    chart1.append("text")//d3.select("svg").append("text")
    .attr("class","xaxislab")
    .attr("transform","translate("+ ((width / 2))+","+(height + margin + 55)+")")
    .text("Total Crime")
    .selectAll('text')
    .style('text-anchor', 'end')
    .style('font-size', '12px');

    headertext = function(data) {if (year != 'All') {return "Total Crimes per State Per Year - " + year} else {return "Total Crimes per State Per Year"};};

    chart1.append("text")//d3.select("svg").append("text")
    .attr("class","xaxislab")
    .data(data)
    .attr("transform","translate("+ ((margin))+","+(25)+")")
    .text(headertext)//"Breakdown of Total Crimes per State Per Year")
    .selectAll('text')
    .style('text-anchor', 'end')
    .style('font-size', '14px');

    classtest1 = function(data) {if (year != 'All') {return "mcannot1"} else {return "mcannot1d"};};
    classtest2 = function(data) {if (year != 'All') {return "mcannot2"} else {return "mcannot2d"};};
console.log("class test1 =", classtest1)
    chart1.append('rect')
    .attr("transform","translate("+ ((margin + 145 ))+","+(120)+")")
    .attr("class",classtest1)
    .attr("width", 215)
    .attr("height", 25)
    .style("stroke","black")
    .style('corners','round')
    .style("fill", "yellow");

    chart1.append('text')
    .attr("class",classtest1)
    .attr("transform","translate("+ ((margin + 150 ))+","+(135)+")")
    .text("Simialr clustering by state is seen")
    .selectAll('text')
    .style('text-anchor', 'end');

    chart1.append("line")
    .attr("x1",410)
    .attr("y1", 130)
    .attr("x2", 475)
    .attr("y2", 125)
    .attr("class",classtest1)
     .style("stroke-width", 2)
     .style("stroke", "black");

     chart1.append("ellipse")
      .attr("cx", 510)
      .attr("cy", 115)
      .attr("rx", 45)
      .attr("ry", 15)
      .attr("class",classtest1)
      .style("fill","none")
      .style("stroke-width",2)
      .style("stroke","black");

    chart1.append('rect')
    .attr("transform","translate("+ ((margin + 300 ))+","+(390)+")")
    .attr("width", 275)
    .attr("height", 25)
    .attr("class",classtest2)
    .style("stroke","black")
    .style("fill", "yellow");

    chart1.append("text")//d3.select("svg").append("text")
    .attr("class",classtest2)
    .attr("transform","translate("+ ((margin + 305 ))+","+(405)+")")
    .text("Not all low population states have low crime")
    .selectAll('text')
    .style('text-anchor', 'start');

    chart1.append("line")
    .attr("x1", 350)
    .attr("y1", 405)
    .attr("x2", 255)
    .attr("y2", 440)
    .attr("class",classtest2)
     .style("stroke-width", 2)
     .style("stroke", "black");

  };
