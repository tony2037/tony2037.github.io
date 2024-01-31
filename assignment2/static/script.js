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

function unixEpochTimeConvert(timestamp) {
  const date = new Date(timestamp * 1000);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = new Intl.DateTimeFormat('en-GB', options).format(date);
  return formattedDate;
}

function changeArrow(arrows, up) {
  var image_path = up ? "../static/images/GreenArrowUp.png" : "../static/images/RedArrowDown.png";
  for (var i = 0; i < arrows.length; i++) {
    arrows[i].src = image_path;
  }
}

function changeArrows(change) {
  var arrows = document.getElementsByClassName("change-arrow");
  if (change >= 0) {
    changeArrow(arrows, true);
  }
  else {
    changeArrow(arrows, false);
  }
}

//TODO: fill the data to corresponding element
function fillData(data) {
  /* company tabs */
  var companyLogo = document.getElementById('company-logo');
  var companyName = document.getElementById('company-company-name');
  var companyStockSymbol = document.getElementById('company-stock-symbol');
  var companyStockCode = document.getElementById('company-stock-code');
  var companyIpo = document.getElementById('company-ipo');
  var companyCategory = document.getElementById('company-category');
  /* stock tabs */
  var stockStockSymbol = document.getElementById('stock-stock-symbol');
  var stockTradingDay = document.getElementById('stock-trading-day');
  var stockClosingPrice = document.getElementById('stock-closing-price');
  var stockOpeningPrice = document.getElementById('stock-opening-price');
  var stockHighPrice = document.getElementById('stock-high-price');
  var stockLowPrice = document.getElementById('stock-low-price');
  var stockChange = document.getElementById('stock-change');
  var stockChangePercent = document.getElementById('stock-change-percent');

  /* company tabs */
  companyLogo.src = data['logo'];
  companyName.innerHTML = data['name'];
  companyStockSymbol.innerHTML = data['ticker'];
  companyStockCode.innerHTML = data['exchange'];
  companyIpo.innerHTML = data['ipo'];
  companyCategory.innerHTML = data['finnhubIndustry'];
  /* stock tabs */
  stockStockSymbol.innerHTML = data['ticker'];
  stockTradingDay.innerHTML = unixEpochTimeConvert(data['t']);
  stockClosingPrice.innerHTML = data['pc'];
  stockOpeningPrice.innerHTML = data['o'];
  stockHighPrice.innerHTML = data['h'];
  stockLowPrice.innerHTML = data['l'];
  changeArrows(data['d']);
  stockChange.innerHTML = data['d'];
  stockChangePercent.innerHTML = data['dp'];
  // TODO: Recommendation Trends

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
