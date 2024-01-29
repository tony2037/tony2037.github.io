'use strict';

window.addEventListener('load', function () {

  console.log("Hello World!");

});

function performSearch() {
  var stockSymbol = document.getElementById('search-input').value;
  console.log("performSearch: " + stockSymbol);
  fetch("/search?stock_symbol=" + stockSymbol, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
  })
  .catch(error => console.error("Error:", error));
}

document.addEventListener("DOMContentLoaded", function() {
  // add an event listener
  document.getElementById("search-form").addEventListener("submit", function(event) {
    event.preventDefault();
    performSearch();
  })
});
