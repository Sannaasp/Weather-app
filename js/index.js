let button = document.querySelector(".button");
let bigCities = document.getElementById("bigCities");
let cities = document.getElementById("cities");

let callWeatherAPIAsync = async function (city) {
  let response = await fetch(
    "https://api.openweathermap.org/data/2.5/weather?q= " +
      city +
      "&units=metric&appid=423626c72eae861fa7705050abaef381&lang=se"
  );
  return response.json();
};
let addEventListeners = function () {
  addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !event.repeat) {
      checkSearchInputValue();
      saveCityInLocalStorage(loadCitiesFromLocalStorage());
    }
  });

  button.addEventListener("click", function () {
    checkSearchInputValue();
    saveCityInLocalStorage(loadCitiesFromLocalStorage());
    randomImage();
  });

  button.addEventListener("mouseover", () => {
    button.style.backgroundColor = "grey";
  });

  button.addEventListener("mouseout", () => {
    button.style.backgroundColor = "";
  });

  bigCities.addEventListener("mouseover", () => {
    bigCities.style.fontSize = "25px";
  });

  bigCities.addEventListener("mouseout", () => {
    bigCities.style.fontSize = "";
  });

  cities.addEventListener("mouseover", () => {
    cities.style.fontSize = "25px";
  });

  cities.addEventListener("mouseout", () => {
    cities.style.fontSize = "";
  });
};

function removeOldSearch() {
  let weatherContainers = document.querySelectorAll(".weatherContainer");

  weatherContainers.forEach((container) => {
    container.remove();
  });
}

function removeSearch() {
  document.querySelector(".inputValue").value = "";
}

async function checkSearchInputValue() {
  removeOldSearch();
  let inputValue = document.querySelector(".inputValue").value;
  if (inputValue) {
    let weatherResult = await callWeatherAPIAsync(inputValue);
    createWeatherInformation(weatherResult, ".divContainer");
    removeSearch();
  }
}

function createWeatherInformation(result, parentDiv) {
  let divContainer = document.querySelector(parentDiv);
  let div = document.createElement("div");
  div.classList.add("weatherContainer");
  let city = createTextNode("h1", result.name, "name");
  let temp = createTextNode(
    "h2",
    Math.round(result.main.temp) + " °C",
    "temperatureText"
  );
  let icon = createImageNode("img", result.weather[0].icon, "iconSize");
  let desc = createTextNode("p", result.weather[0].description, "desc");
  let wind = createTextNode("p", `${result.wind.speed} m/s`, "wind");
  let feelsLike = createTextNode(
    "h3",
    "Känns som " + Math.round(result.main.feels_like) + " °C",
    "temperatureText"
  );

  div.appendChild(city);
  div.appendChild(temp);
  div.appendChild(icon);
  div.appendChild(feelsLike);
  div.appendChild(desc);
  div.appendChild(wind);
  divContainer.appendChild(div);
}

function createTextNode(tagType, textContent, styleClass) {
  let tag = document.createElement(tagType);
  let tagText = document.createTextNode(textContent);
  tag.appendChild(tagText);
  tag.classList.add(styleClass);
  return tag;
}

function createImageNode(tagType, icon, styleClass) {
  let tag = document.createElement(tagType);
  tag.src = `http://openweathermap.org/img/wn/${icon}.png`;
  tag.classList.add(styleClass);
  return tag;
}

function randomImage() {
  const img = document.getElementById("random_images_example");
  const srcArray = ["autumn.jpg", "green.jpg", "wood.jpg"];
  let index;

  const randomIndex = Math.floor(Math.random() * srcArray.length);

  if (randomIndex !== index) {
    img.style.backgroundImage = `url('random_images/${srcArray[randomIndex]}')`;

    index = randomIndex;
  } else {
    randomImage();
  }
}

let loadCitiesFromLocalStorage = function () {
  let localStorageArray = [];
  let localStorageJSON = localStorage.getItem("inputValue");
  if (localStorageJSON) {
    localStorageArray = Array.from(JSON.parse(localStorageJSON));
  }
  return localStorageArray;
};

let saveCityInLocalStorage = function (localStorageArray) {
  let inputValue = document.querySelector(".inputValue");
  if (inputValue.value) {
    localStorageArray.push(inputValue.value);
    if (localStorageArray.length > 5) {
      localStorageArray.shift();
    }
  }

  localStorage.setItem("inputValue", JSON.stringify(localStorageArray));
  updateOldCitySearchesHTML(localStorageArray);
};

let updateOldCitySearchesHTML = function (localStorageArray) {
  let oldSearch = document.querySelector("#oldSearch");
  oldSearch.innerHTML = "";
  let previousSearchText = document.createElement("p");

  previousSearchText.appendChild(
    document.createTextNode(`Tidigare Sökningar: `)
  );
  previousSearchText.classList.add("oldSearchText");
  let ol = document.createElement("ol");
  for (let i = 0; i < localStorageArray.length; i++) {
    let oldCityText = document.createElement("li");
    oldCityText.appendChild(document.createTextNode(localStorageArray[i]));
    ol.appendChild(oldCityText);
  }
  oldSearch.appendChild(previousSearchText);
  oldSearch.appendChild(ol);
};

randomImage();
updateOldCitySearchesHTML(loadCitiesFromLocalStorage());
addEventListeners();
