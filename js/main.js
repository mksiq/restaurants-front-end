// global variables
var restaurantData = [];
var currentRestaurant = {};
var page = 1;
const perPage = 10;
var map = null;

const uri =
  "https://web422-assignment1-msiqueira.herokuapp.com/api/restaurants";

const tableTemplate = _.template(`
    <% _.forEach(restaurantData, function(restaurant) {
        %>  
        <tr scope="row" data-id="<%- restaurant._id %>" data-bs-toggle="modal" data-bs-target="#restaurant-modal">
        <td><%- restaurant.name %></td>
        <td><%- restaurant.cuisine %></td>
        <td><%- restaurant.address.building%> <%- restaurant.address.street  %></td>
        <td><%- avg(restaurant.grades).toFixed(2) %></td>
        </tr> <% }); %>
    `);

$(async function () {
  displayWaitForServer();
  await loadRestaurantData();

  //watch for click on row
  $("#restaurant-table tbody").on("click", "tr", async function () {
    const response = await fetch(`${uri}/${$(this).attr("data-id")}`);
    const data = await response.json();
    currentRestaurant = data.restaurant;
    $(".modal-title").html(currentRestaurant.name);
    $("#restaurant-address").html(
      `${currentRestaurant.address.building} ${currentRestaurant.address.street}`
    );
    loadMap();
  });

  nextPage();

  previousPage();

  $("#restaurant-modal").on("hidden.bs.modal", function () {
    if (map) {
      map.remove();
    }
  });
});

// move to next page
function nextPage() {
  $("#next").on("click", function (e) {
    e.preventDefault();
    page++;
    loadRestaurantData();
    $("#page").html(page);
    $("#previous").removeClass("disabled");
  });
}

// move to previous page
function previousPage() {
  $("#previous").on("click", function (e) {
    e.preventDefault();
    if ($("#page").html() > 1) {
      page--;
      loadRestaurantData();
      $("#page").html(page);
    }
    if (page == 1) {
      $("#previous").addClass("disabled");
    }
  });
}

function loadMap() {
  map = new L.Map("leaflet", {
    center: [
      currentRestaurant.address.coord[1],
      currentRestaurant.address.coord[0],
    ],
    zoom: 18,
    layers: [
      new L.TileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"),
    ],
  });
  L.marker([
    currentRestaurant.address.coord[1],
    currentRestaurant.address.coord[0],
  ]).addTo(map);
}

/**
 *  Gives message while waiting for heroku to wake up
 */
function displayWaitForServer() {
  const temp = $("<tr></tr>").append(
    "<p>Data is loading. Wait for a few seconds for it to load. If it does not: Please refresh page.</p>"
  );
  $("#restaurant-table tbody").append(temp);
}

async function loadRestaurantData() {
  const response = await fetch(`${uri}?page=${page}&perPage=${perPage}`);
  const data = await response.json();
  restaurantData = data.restaurants;
  let rows = tableTemplate({ restaurantData: restaurantData });
  // Makes sure the table is empty before inserting rows
  $("#restaurant-table tbody").empty();
  $("#restaurant-table tbody").append(rows);
}

function avg(grades) {
  return grades.reduce((acc, cur) => acc + cur.score, 0) / grades.length;
}
