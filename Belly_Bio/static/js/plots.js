function init() {
    var data = [{
      values: [0,0,0,0],
      labels: ["BB_940", "BB_941", "BB_942", "BB_943"],
      type: "pie"
    }];
  
    var layout = {
      height: 600,
      width: 800
    };
  
    Plotly.plot("pie", data, layout);
  }
  
  function optionchanged(dataName) {
      var data = [];
      url="/samples/"+dataName;
    //take the dataName and grab the data in the "/samples/dataName' page
    //store data in data array--from Sample Value
    //store the out_id names in the "labels"
    //probably call the updatePlotly(arraySentHere)
    Plotly.d3.json(url, function(error, response) {

        if (error) return console.warn(error);
    
        // Grab values from the response json object to build the plots
        // var name = response.dataset.name;
        // var stock = response.dataset.dataset_code;
        // var startDate = response.dataset.start_date;
        // var endDate = response.dataset.end_date;
        var data = unpack(response.dataset, 0);
        //var data = unpack(response,0);
        var labels = unpack(response.dataset, 1);
        //var labels = response[1];
    
        // var trace1 = {
        //   type: "scatter",
        //   mode: "lines",
        //   name: name,
        //   x: dates,
        //   y: closingPrices,
        //   line: {
        //     color: "#17BECF"
        //   }
        // };
    
        // var data = [trace1];
    
    updatePlotly(data);
    });
  }//blah blah look at meeeeeeee!


  function updatePlotly(newdata) {
    var PIE = document.getElementById("pie");
    Plotly.restyle(PIE, "values", [newdata]);
  }
  
  function getData(dataset) {
    var data = [];
    switch (dataset) {
    case "dataset1":
      data = [1, 2, 3, 39];
      break;
    case "dataset2":
      data = [10, 20, 30, 37];
      break;
    case "dataset3":
      data = [100, 200, 300, 23];
      break;
    default:
      data = [0,0,0,0];
    }
    updatePlotly(data);
  }
  
  init();
  