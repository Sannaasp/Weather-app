let data = [];
performWeatherCalls();
async function performWeatherCalls() {
  await getWeatherForCity("London", ".firstRow");
  await getWeatherForCity("Stockholm", ".firstRow");
  await getWeatherForCity("New York", ".firstRow");
  await getWeatherForCity("Los Angeles", ".secondRow");
  await getWeatherForCity("Buenos Aires", ".secondRow");
  await getWeatherForCity("Peking", ".secondRow");
  createLineGraph();
}

async function getWeatherForCity(city, parentDiv) {
  let result = await callWeatherAPIAsync(city);
  createWeatherInformation(result, parentDiv);
  data.push({ temp: result.main.temp, name: result.name });
}

function createLineGraph() {
  const ctx = document.getElementById("myLine");

  new Chart(ctx, {
    type: "line",
    data: {
      labels: data.map((row) => row.name),
      datasets: [
        {
          label: "Temperaturer över städerna",
          data: data.map((row) => row.temp),
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: false,
        },
      },
    },
  });
}
