let x = 900;
let aspectRatio = 16.0 / 9.0;
let y = x / aspectRatio;
let svg = d3.select("body").append("svg").attr("id", "svg").attr("viewBox", "0 0 " + x + " " + y);
let tooltip = document.getElementById("tooltip");
let Step = x * 0.02;
let padding = 
    {
      top: y * 0.15,
      left: x * 0.1,
      right: x * 0.1,
      bottom: y * 0.1
    }

let DrawText = () =>
{
  svg.append("text")
    .text("Doping in Professional Bicycle Racing")
    .attr("y", Step * 2)
    .attr("x", x / 2)
    .attr("id", "title")
    .attr("font-size", "2em")
    .attr("text-anchor", "middle");
   svg.append("text")
    .text("Time in Minutes")
    .attr("y", Step*2)
    .attr("x", -y / 2)
    .attr("font-size", "1.5em")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)");
 }

let scaleX;
let scaleY;

let CreateScales = (dataset) =>
{
  scaleY = d3.scaleTime();
  scaleY.range([padding.top, y - padding.bottom]);
  scaleY.domain(d3.extent(dataset, (d) =>
  {
    let time = d.Time.split(":");
    return new Date(1970, 0, 0, 0, time[0], time[1]);
  }));
  maxX = d3.max(dataset, (d) => d.Year + 1);
  minX = d3.min(dataset, (d) => d.Year - 1);
  
  scaleX = d3.scaleLinear();
  scaleX.range([padding.left, x - padding.right])
  .domain([minX, maxX]);
}

let DrawAxis = () =>
{
  svg.append("g")
    .attr("transform", "translate(" + padding.left + ",0)")
    .attr("id", "y-axis")
    .call(d3.axisLeft(scaleY).tickFormat(d3.timeFormat('%M:%S')));
  svg.append("g")
    .attr("transform", "translate(0, " +(y - padding.bottom) + ")")
    .attr("id", "x-axis")
    .call(d3.axisBottom(scaleX).tickFormat(d3.format("d")));
}

let color = d3.scaleOrdinal(d3.schemeCategory10);

let DrawDots = (dataset) =>
{
 let r = x / 200; svg.selectAll("circle").data(dataset).enter().append("circle")
   .attr("class", "dot")
   .attr("data-xvalue", (d) => d.Year)
   .attr("cx", (d) => scaleX(d.Year))
   .attr("data-yvalue", (d) => d.Time)
   .attr("cy", (d) => 
   {
    let time = d.Time.split(":");
    return scaleY(new Date(1970, 0, 0, 0, time[0], time[1]));
   })
   .attr("r", r)
   .attr("data-yvalue", (d) => 
    {
    let time = d.Time.split(":");
    return new Date(1970, 0, 0, 0, time[0], time[1]);
    })
    .attr("fill", (d) => color(d.Doping == ""))
    .on("mouseover", (e, d) =>
    {
      tooltip.style.opacity = 0.8;
      tooltip.innerHTML = d.Name + ": " + d.Nationality + "<br>";
      tooltip.innerHTML += "Year: " + d.Year + ", Time: " + d.Time;
      if(d.Doping)
      {
        tooltip.innerHTML +="<br><br>" +  d.Doping;
        tooltip.setAttribute("data-year", d.Year);
      }
    })
    .on("mousemove", (d) =>
    {
      tooltip.style.top = (event.pageY - 40) + "px";
      tooltip.style.left = (event.pageX + 5) + "px";
    })
    .on("mouseout", (d) =>
    {
      tooltip.style.opacity = 0;
    })
}

let DrawLegend = () =>
{
  let legend = svg.append("g").attr("id", "legend");
  //lenged = svg.selectAll("#legend");
  legend = legend.selectAll(".legend")
  .data(color.domain())
  .enter()
  .append("g")
  .attr("transform", (d, i) => 
  {
     return "translate(0," + (y / 3 + Step * i * 1.5) + ")";
  });
  legend
  .append("rect")
  .attr("width", Step)
  .attr("height", Step)
  .attr("x", x - Step*4)
  .attr("fill", color);
  legend.append("text")
  .attr("text-anchor", "end")
  .text((d) => 
  {
    if(d) return "No doping allegations"
    else return "Riders with doping allegations"
  })
  .attr("y", Step * 0.8)
  .attr("x", x - Step * 5);
}
document.addEventListener("DOMContentLoaded",function()
{ d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json").then( d =>
 {
   console.log(d);
   DrawText();
   CreateScales(d);
   DrawAxis();
   DrawDots(d);
   DrawLegend();
 })
})