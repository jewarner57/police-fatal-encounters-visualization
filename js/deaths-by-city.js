function handleCityData(deathData) {
  const data = getKillingsByCity(deathData)

  const width = 700
  const height = 700

  const sizeExtent = d3.extent(data, d => parseFloat(d.count))
  const sizeScale = d3.scaleLinear()
    .domain(sizeExtent)
    .range([30, 100])

  const colorExtent = d3.extent(data, d => parseFloat(d.count))
  const colorScale = d3.scaleLinear()
    .domain(colorExtent)
    .range([0, 100])

  var circles = data.map((city) => {
    return {
      r: sizeScale(city.count),
      color: `hsl(49, ${colorScale(city.count)}%, 50%)`,
      text: city.key,
      value: city.count
    }
  })

  circles.sort((a, b) => b.r - a.r);

  d3.packSiblings(circles);

  // Select the SVG
  const svg = d3
    .select(`#deaths-by-city`)

  const cities = svg.append('g')
    .attr('transform', `translate(${width / 2},${height / 2})`)

  // State circles
  cities
    .append('g')
    .selectAll('circle.node')
    .data(circles)
    .enter()
    .append('circle')
    .classed('node', true)
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
    .attr('r', d => d.r)
    .attr('fill', d => d.color)

  // city abbreviation labels
  cities
    .append('g')
    .selectAll('text.node')
    .data(circles)
    .enter()
    .append('text')
    .style('font-family', "'Roboto', sans-serif")
    .style('font-size', d => d.r / 3.2)
    .text(d => d.text)
    .attr('text-anchor', 'middle')
    .attr('x', d => d.x)
    .attr('y', d => d.y)

  // city count labels
  cities
    .append('g')
    .selectAll('text.node')
    .data(circles)
    .enter()
    .append('text')
    .style('font-family', "'Roboto', sans-serif")
    .style('font-size', d => d.r / 3)
    .text(d => d.value)
    .attr('text-anchor', 'middle')
    .attr('x', d => d.x)
    .attr('y', d => (d.y + d.r / 4) + d.r / 4)

  // create the graph title
  svg.append("text")
    .attr("x", (width / 2))
    .attr("y", 45)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .style('font-family', "'Roboto', sans-serif")
    .text("Top 20 U.S. Cities Ranked by Most Fatal Police Encounters")
}

function getKillingsByCity(data) {
  killingsByCity = {}

  for (person of data) {
    const city = person['Location of death (city)']

    // If there is no entry for this state yet
    if (!killingsByCity[city]) {
      // create one
      killingsByCity[city] = { key: city, count: 0 }
    }

    killingsByCity[city].count += 1
  }

  killingsByCity = Object.values(killingsByCity).sort((a, b) => a.val - b.val)

  return killingsByCity.slice(0, 20)
}