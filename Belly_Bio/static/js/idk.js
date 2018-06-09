function buildPlot() {

  
    var url = "/names";
  
    Plotly.d3.json(url, function(error, response) {
  
      if (error) return console.warn(error);
  
      // Grab values from the response json object to build the plots
      var list_of_names = response.dataset["sample names"];
      