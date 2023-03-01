let buttonCity = document.querySelector("button");
let postButton = document.querySelector("#postButton");
let deleteButton = document.querySelector("#deleteButton");

let callCitiesApi = async function (city) {
  console.log(city);
  let response = await fetch("https://avancera.app/cities/?name=" + city);
  return response.json();
};

let postCity = async function (city, population) {
  await fetch("https://avancera.app/cities/", {
    body: JSON.stringify({ name: city, population: Number(population) }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
    });
};

let deleteCity = async function (id) {
  await fetch(`https://avancera.app/cities/${id}`, {
    method: "DELETE",
  }).then((response) => {
    console.log(response);
  });
};

let putCity = async function (id, name, population) {
  fetch(`https://avancera.app/cities/${id}`, {
    body: JSON.stringify({
      id: id,
      name: name,
      population: Number(population),
    }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "PUT",
  }).then((response) => {
    console.log(response);
  });
};

buttonCity.addEventListener("click", function () {
  clearPreviousGetSearch();
  checkSearchInputValue();
});

postButton.addEventListener("click", function () {
  clearPreviousPostSearch();
  checkPostInputValue();
});

function removeSearch() {
  document.querySelector(".inputValue").value = "";
}

let checkSearchInputValue = async function () {
  let inputValue = document.querySelector(".inputValue").value;
  if (inputValue) {
    getCities(inputValue, "#searchText");
    removeSearch();
  }
};

let checkPostInputValue = async function () {
  let postInputValue = document.querySelector("#postValue").value;
  let postPopulation = document.querySelector("#postPopulation").value;
  if (postInputValue && Number(postPopulation)) {
    await postCity(postInputValue, postPopulation);
    getCities(postInputValue, "#postText");
  }
};

let clearPreviousGetSearch = function () {
  let searchText = document.getElementById("searchText");
  searchText.innerHTML = "";
};

let clearPreviousPostSearch = function () {
  let postText = document.getElementById("postText");
  postText.innerHTML = "";
};

let getCities = async function (city, parentDiv) {
  let cityResult = await callCitiesApi(city);

  createCityInformation(cityResult[0], parentDiv);
};

function createCityInformation(result, parentDiv) {
  let divContainer = document.querySelector(parentDiv);
  let div = document.createElement("div");
  let name = createTextNode("p", "name:", "name");
  let nameInput = createTextNode("input", result.name, "nameInput");
  nameInput.value = result.name;
  let population = createTextNode("p", "population: ", "population");
  let populationInput = createTextNode(
    "input",
    result.population,
    "populationInput"
  );
  populationInput.value = result.population;

  let updateButton = document.createElement("button");
  let updateImg = document.createElement("img");
  updateImg.setAttribute("src", "../icons/pencil.png");
  updateImg.setAttribute("height", 15);
  updateImg.setAttribute("width", 15);
  let deleteButton = document.createElement("button");
  let img = document.createElement("img");
  let buttonContainer = document.createElement("div");
  buttonContainer.classList.add("buttonContainer");
  img.setAttribute("src", "../icons/close.png");
  img.setAttribute("height", 15);
  img.setAttribute("width", 15);

  div.appendChild(name);
  div.appendChild(nameInput);
  div.appendChild(population);
  div.appendChild(populationInput);
  buttonContainer.appendChild(updateButton);
  buttonContainer.appendChild(deleteButton);
  updateButton.appendChild(updateImg);
  div.appendChild(buttonContainer);
  deleteButton.appendChild(img);
  divContainer.appendChild(div);

  nameInput.classList.add("p");

  updateButton.addEventListener("click", function () {
    putCity(result.id, nameInput.value, populationInput.value);
  });

  deleteButton.addEventListener("click", function () {
    deleteCity(result.id);
    divContainer.removeChild(div);
  });
}

function createTextNode(tagType, textContent, styleClass) {
  let tag = document.createElement(tagType);
  let tagText = document.createTextNode(textContent);
  tag.appendChild(tagText);
  tag.classList.add(styleClass);
  return tag;
}
