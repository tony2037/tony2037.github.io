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
  /* recommendation trends */
  var squareStrongSell = document.getElementById('square-strongSell');
  var squareSell = document.getElementById('square-sell');
  var squareHold = document.getElementById('square-hold');
  var squareBuy = document.getElementById('square-buy');
  var squareStrongBuy = document.getElementById('square-strongBuy');

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
  /* recommendation trends */
  var recommendationTrends = ('recommendation_trends' in data) ? data['recommendation_trends'] : null;
  if (recommendationTrends) {
    squareStrongSell.innerHTML = recommendationTrends['strongSell'];
    squareSell.innerHTML = recommendationTrends['sell'];
    squareHold.innerHTML = recommendationTrends['hold'];
    squareBuy.innerHTML = recommendationTrends['buy'];
    squareStrongBuy.innerHTML = recommendationTrends['strongBuy'];
  }
  /* news tabs */
  var top5 = data['company_news']
  for (var i = 0; i < top5.length; i++) {
    var news = top5[i]
    /* data */
    var image = news['image']
    var title = news['headline']
    var epoch = news['datetime']
    var datetime = unixEpochTimeConvert(epoch)
    var url = news['url']
    /* ids */
    var imgId = `news-img-${i}`
    var imgElement = document.getElementById(imgId)
    imgElement.src = image
    var titleId = `news-title-${i}`
    var titleElement = document.getElementById(titleId)
    titleElement.innerHTML = title
    var dateId = `news-date-${i}`
    var dateElement = document.getElementById(dateId)
    dateElement.innerHTML = datetime
    var urlId = `news-url-${i}`
    var urlElement = document.getElementById(urlId)
    urlElement.href = url
  }

}

function fillChart(symbol, data) {
  const getToday = () => {
    const currentDate = new Date();
    const day = ("0" + currentDate.getDate()).slice(-2); // get two digit
    const month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
    const year = currentDate.getFullYear();
    var res = `${year}-${month}-${day}`
    return res
  }
  var title = `Stock Price ${symbol} ${getToday()}`
  var prices = []
  var volumes = []
  var days = data['resultsCount']
  var results = data['results']
  for (var i = 0; i < days; i++) {
    var result = results[i]
    var t = result['t']
    var c = result['c']
    var v = result['v']
    prices.push([t,c]);
    volumes.push([t,v]);
  }

  // Create the chart
  Highcharts.stockChart('chart-container', {
    rangeSelector: {
        selected: 1
    },

    title: {
        text: title
    },

    subtitle: {
        text: '<a href="https://polygon.io/">Source: Polygon.io</a>',
        useHTML: true,
    },

    rangeSelector: {
      buttons: [{
          type: 'day',
          count: 7,
          text: '7d'
      }, {
          type: 'day',
          count: 15,
          text: '15d'
      }, {
        type: 'month',
        count: 1,
        text: '1m'
      }, {
        type: 'month',
        count: 3,
        text: '3m'
      }, {
          type: 'month',
          count: 6,
          text: '6m'
      }],
      selected: 3,
      inputEnabled: false
  },

  yAxis: [{
    labels: {
        align: 'left'
    },
    title: {
        text: 'Stock Price',
        offset: 30
    },
    opposite: false  // Display this y-axis on the left side
}, {
    labels: {
        align: 'right'
    },
    title: {
        text: 'Volume',
        offset: 30
    },
    opposite: true  // Display this y-axis on the right side
}],

  series: [{
      name: `${symbol} Price`,
      type: 'area',
      data: prices,
      tooltip: {
          valueDecimals: 2,
      },
      fillColor: {
          linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1
          },
          stops: [
              [0, Highcharts.getOptions().colors[0]],
              [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
          ]
      },
      threshold: null,
      zIndex: 2
  }, {
      name: `${symbol} Volume`,
      type: 'column',
      color: 'black',
      zIndex: 1,
      yAxis: 1,
      data: volumes
  }
  ],

});
}

function performSearch() {
  var searchInputElement = document.getElementById('search-input')
  var stockSymbol = searchInputElement.value;

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
    if (Object.keys(data).length == 0 || data['success'] != true) {
      // Cannot find record for this symbol
      changeSearchState(searchState.Error);
    }
    else {
      // Found the record
      changeSearchState(searchState.Success);
      fillData(data);
      'polygon_res' in data ? fillChart(data['ticker'], data['polygon_res']) : null
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
