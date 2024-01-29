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

/* Switch the tabs in the result box */
function openTab(tabName, tabButton) {
  /* change tabs color */
  var buttons = document.getElementsByClassName("result-tab");
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].style.backgroundColor = "transparent";
  }
  var button = document.getElementById(tabButton);
  button.style.backgroundColor = "#CBCBCB";

  /* show the info */
  var tabs = document.getElementsByClassName("result-info");
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].style.display = "none";
  }
  var tab = document.getElementById(tabName)
  tab.style.display = "block";
}

document.addEventListener("DOMContentLoaded", function() {
  // add an event listener
  document.getElementById("search-form").addEventListener("submit", function(event) {
    event.preventDefault();
    performSearch();
  })
});
