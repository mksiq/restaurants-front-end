var restaurantData = [];
var currentRestaurant = {};
var page = 1;
const perPage = 10;
var map = null;

console.log("main.js working");

const uri =
  "https://web422-assignment1-msiqueira.herokuapp.com/api/restaurants?";

const tableTemplate = _.template(`
    <tbody>
    <% _.forEach(restaurantData, function(restaurant) {
        %>  
        <tr scope="row" data-id="<%- restaurant._id %>">
        <td><%- restaurant.name %></td>
        <td><%- restaurant.cuisine %></td>
        <td><%- restaurant.address.building%> <%- restaurant.address.street  %></td>
        <td><%- avg(restaurant.grades).toFixed(2) %></td>
        </tr> <% }); %>
    </tbody>`);

function loadRestaurantData() {
  fetch(`${uri}page=${page}&perPage=${perPage}`).then((res) => {
    res.json().then((data) => {
      restaurantData = data.restaurants;
      let rows = tableTemplate({ restaurantData: restaurantData });
      $("#restaurant-table").append(rows);
    });
  });
}

function avg(grades) {
  return grades.reduce((acc, cur) => acc + cur.score, 0) / grades.length;
}

$(function () {
  loadRestaurantData();
  console.log("before click");
  $("#restaurant-table tbody").on("click", "tr", function () {
    // watch the tbody element contained within an element with class "my-table" and execute code whenever new (or existing) <tr> elements are clicked
    console.log("table row clicked!");
  });
  console.log("after click");
});

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
