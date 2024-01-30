'use strict';

window.addEventListener('load', function () {

  console.log("Hello World!");

});

const searchState = {
  'Init': 0,
  'Success': 1,
  'Error': 2
};
function changeSearchState(state) {
  var errorBlock = document.querySelector('.result-error#result-bg');
  var successBlock = document.querySelector('.result-success');
  switch(state) {
    case searchState.Success:
      errorBlock.style.display = "none";
      successBlock.style.display = "block";
      break;
    case searchState.Error:
      errorBlock.style.display = "block";
      successBlock.style.display = "none";
      break;
    case searchState.Init:
    default:
      errorBlock.style.display = "none";
      successBlock.style.display = "none";
  }
}


//TODO: fill the data to corresponding element
function fillData(data) {
  var logo = document.getElementById('company-logo');
  var companyName = document.getElementById('company-company-name');
  var stockSymbol = document.getElementById('company-stock-symbol');
  var stockCode = document.getElementById('company-stock-code');
  var ipo = document.getElementById('company-ipo');
  var category = document.getElementById('company-category');

  logo.src = data['logo'];
  companyName.innerHTML = data['name'];
  stockSymbol.innerHTML = data['ticker'];
  stockCode.innerHTML = data['exchange'];
  ipo.innerHTML = data['ipo'];
  category.innerHTML = data['finnhubIndustry'];
}

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
    // FIXME: remove the log
    console.log(data);
    if (Object.keys(data).length == 0) {
      // Cannot find record for this symbol
      changeSearchState(searchState.Error);
    }
    else {
      // Found the record
      changeSearchState(searchState.Success);
      fillData(data);
    }
  })
  .catch(error => console.error("Error:", error));
}

function clearSearch() {
  document.getElementById('search-input').value = "";
  changeSearchState(searchState.Init);
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
