let x = 900;
let aspectRatio = 16.0 / 7.0;
let y = x / aspectRatio;

let toolTip = document.getElementById("tooltip");


let svg = d3.select("body")
.append("svg")
.attr("id", "svg")
.attr("viewBox", "0, 0, " + x + ", " + y);

let colors = 
    [
      '#053061',
      '#2166ac',
      '#4393c3',
      '#92c5de',
      '#d1e5f0',
      '#f7f7f7',
      '#fddbc7',
      '#f4a582',
      '#d6604d',
      '#b2182b',
      '#67001f',
    ]
let pad = 
    {
      top: y * 0.2,
      rig: x * 0.05,
      bot: y * 0.15,
      lef: x * 0.1
    }

let step = x * 0.02;
let drawText = (d) =>
{
  svg.append("text")
    .text("Monthly Global Land-Surface Temperature")
    .attr("x", x / 2)
    .attr("y", step*2)
    .attr("font-size", "2em")
    .attr("text-anchor", "middle")
    .attr("id", "title");
  let Years = d3.extent(d.monthlyVariance, (d) => d.year)
  console.log(Years);
  svg.append("text")
    .text(Years[0] + " - " + Years[1] + ": base temperature " + d.baseTemperature + "℃")
    .attr("x", x / 2)
    .attr("y", step * 4)
    .attr("text-anchor", "middle")
    .attr("id", "description")
    .attr("font-size", "1.5em")
  svg.append("text")
    .text("Months")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .attr("y", step)
    .attr("x", -y / 2)    
}

let xScale;
let yScale;
let colorScale;

let minMaxTemp;

let legendData = [];

let calculateScales = (dataset, baseTemp) => 
{
  xScale = d3.scaleTime();
  xScale.domain(d3.extent(dataset, d =>
   {
      return new Date(d.year, d.month); 
  }))
  xScale.range([pad.lef, x - pad.rig]);
  //console.log(xScale);
  yScale = d3.scaleBand();
  yScale.range([pad.top,y - pad.bot])
  yScale.domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
  minMaxTemp = d3.extent(dataset, d => d.variance + baseTemp)
  console.log(minMaxTemp)
  colorScale = d3.scaleThreshold();
  colorScale.domain(
        (function (min, max, count) {
          let array = [];
          let step = (max - min) / count;
          let base = min;
          //legendData.push([base, base + step]);
          for(let i = 0; i < count; i++) {
            array.push(base + i * step);
            legendData.push([base + i * step, base + i * step + step])
          }
          console.log(array)
          array.push(base + count * step)
          return array;
        })(minMaxTemp[0], minMaxTemp[1], colors.length-1)
      );
  colorScale.range(colors);
  //.rangeRoundBands([0, 5], 0, 0);
  //.rangeRoundBands([0, 0]);
}
let months = 
 [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
 ]
let drawAxis = () =>
{
  svg.append("g")
    .attr("transform", "translate(0, " + (y - pad.bot) + ")")
    .attr("id", "x-axis")
    .call(d3.axisBottom(xScale).tickSizeOuter(0));
  svg.append("g")
    .attr("transform", "translate(" + pad.lef + ", 0)")
    .attr("id", "y-axis")
    .call(d3.axisLeft(yScale).tickFormat(d => months[d]).tickSizeOuter(0))
  
  
  // i dont know what i did here but it works, hope god wont see this
  console.log("colorscaledomain")
  console.log(colorScale.domain())
  let legendScale = d3.scaleLinear()
  .domain(minMaxTemp)
  .range([0, x / 2 - pad.lef])
  let legendAxis = d3.axisBottom(legendScale)
  .tickValues(colorScale.domain())
  .tickFormat(d3.format(".1f"))
  .tickSizeOuter(1)
  console.log(colorScale.range())
  console.log(legendData)
  svg.append("g")
    .attr("id", "legend")
    .attr("transform", "translate(" + pad.lef + ", " + (y - pad.bot / 3) + ")")
    .call(legendAxis)
    .append("g")
    .selectAll(".legendRect")
    .data(legendData)
    .enter()
    .append('rect')
      .attr('fill', d => colorScale(d[0])
      )
    .attr("x", d => legendScale(d[0]))
    .attr("y", -pad.bot / 4)
    .attr("width", d => legendScale(d[1]) - legendScale(d[0]))
    .attr("height", pad.bot / 4)
    
  
}

let drawData = (data, baseTemp) =>
{
  let width = xScale(new Date(1, 0, 0, 0, 0, 0, 0)) - xScale(new Date(0, 0, 0, 0, 0, 0, 0))
  console.log(width)
  svg.selectAll(".cell")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("data-month", d => d.month-1)
    .attr("data-year", d => d.year)
    .attr("data-temp", d => d.variance + baseTemp)
    .attr("fill", d => colorScale(d.variance + baseTemp))
    .attr("y", d => yScale(d.month-1))
    .attr("x", d => xScale(new Date(d.year, 0, 0, 0, 0, 0, 0)))
    .attr("width", width)
    .attr("height", yScale(1) - yScale(0))
    .on("mouseover", (event, data) =>
    {
    console.log(event)
    let width = tooltip.clientWidth / 2;
    let height = tooltip.clientHeight;
        tooltip.style.left = (event.pageX - width + "px")
      tooltip.style.top = (event.pageY - height+ "px")
    tooltip.setAttribute("data-year", data.year)
    tooltip.innerHTML = data.year + ' - ' + months[data.month-1];
    tooltip.innerHTML += "<br>";
    tooltip.innerHTML += Math.round((data.variance + baseTemp) * 10) / 10 +"℃"+ "<br>";
    tooltip.innerHTML += Math.round(data.variance * 10) / 10 + "℃";
    })
    .on('mousemove',  (event, data) =>
    {
      let width = tooltip.clientWidth / 2;
    let height = tooltip.clientHeight;
        tooltip.style.left = (event.pageX - width + "px")
      tooltip.style.top = (event.pageY - height+ "px")
    tooltip.style.opacity = 0.8;
    
    })
    .on("mouseout", (d) =>
    {
      tooltip.style.opacity = 0;
    })
}
document.addEventListener("DOMContentLoaded",d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json").then((d) =>
{
  console.log(d);
  drawText(d)
  calculateScales(d.monthlyVariance, d.baseTemperature);
  drawAxis();
  drawData(d.monthlyVariance, d.baseTemperature);
}
)
)