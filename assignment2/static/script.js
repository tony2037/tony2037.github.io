'use strict';

window.addEventListener('load', function () {

  console.log("Hello World!");

});

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("search_box").addEventListener("submit", function(event) {
    event.preventDefault();

    var stockSymbol = document.getElementById("search_input").value;

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
  });
});
