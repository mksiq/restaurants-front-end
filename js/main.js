var restaurantData = [];
var currentRestaurant = {};
var page = 1;
const perPage = 10;
var map = null;

console.log("main.js working");

const uri =
  "https://web422-assignment1-msiqueira.herokuapp.com/api/restaurants";

const tableTemplate = _.template(`
    
    <% _.forEach(restaurantData, function(restaurant) {
        %>  
        <tr scope="row" data-id="<%- restaurant._id %>" data-bs-toggle="modal" data-bs-target="#leaftlet">
        <td><%- restaurant.name %></td>
        <td><%- restaurant.cuisine %></td>
        <td><%- restaurant.address.building%> <%- restaurant.address.street  %></td>
        <td><%- avg(restaurant.grades).toFixed(2) %></td>
        </tr> <% }); %>
    `);

function loadRestaurantData() {
  fetch(`${uri}?page=${page}&perPage=${perPage}`).then((res) => {
    res.json().then((data) => {
      restaurantData = data.restaurants;
      let rows = tableTemplate({ restaurantData: restaurantData });
      $("#restaurant-table tbody").append(rows);
    });
  });
}

function avg(grades) {
  return grades.reduce((acc, cur) => acc + cur.score, 0) / grades.length;
}

$(function () {
  loadRestaurantData();

  //watch for click on row
  $("#restaurant-table tbody").on("click", "tr", function () {
    fetch(`${uri}/${$(this).attr("data-id")}`).then((res) =>
      res.json().then((data) => {
        currentRestaurant = data.restaurant;
        $(".modal-title").html(currentRestaurant.name);
        $("#restaurant-address").html(`${currentRestaurant.address.building} ${currentRestaurant.address.street}`)
      })
    );
  });

  nextPage();
  previousPage();
});

// move to next page
function nextPage() {
    $("#next").on("click", function (e) {
        e.preventDefault();
        page++;
        $("#restaurant-table tbody").empty();
        loadRestaurantData();
        $("#page").html(page);
        $("#previous").removeClass("disabled");
    });
}

// move to previous page
function previousPage() {
    $("#previous").on("click", function (e) {
        e.preventDefault();
        if($("#page").html() > 1) {
            page--;
            $("#restaurant-table tbody").empty();
            loadRestaurantData();
            $("#page").html(page);
        }
        if(page == 1) {
            $("#previous").addClass("disabled");
        }
    });
}
// $(document).ready(function () {
//   // const test = new Promise(fillTable(restaurantData)).then( ready => console.log(ready));

//   $("#next-page").click(function (e) {
//     e.preventDefault();
//     page++;

//     $("#restaurant-table tbody").remove();

//     fetch(
//       `http://localhost:8080/api/restaurants?page=${page}&perPage=${perPage}&borough=Bronx`
//     ).then((res) => {
//       res.json().then((data) => {
//         restaurantData = data;
//         let tableTemplate = _.template(` <tbody>
//         <% _.forEach(restaurantData, function(restaurant) {
//             %>
//             <tr id="<%- restaurant.restaurant-id %>">
//             <td><%- restaurant.name %></td>
//             <td><%- restaurant.cuisine %></td>
//             <td><%- restaurant.address.building%> <%- restaurant.address.street  %></td>
//             <td><%- avg(restaurant.grades).toFixed(2) %></td>
//             </tr>  <% }); %>
//             </tbody>`);
//         let rows = tableTemplate({ restaurantData: restaurantData });
//         $("#restaurant-table").append(tableTemplate);
//       });
//     });
//   });
// });
