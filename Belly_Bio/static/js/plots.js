// function init() {
//     var data = [{
//       values: [1,2,5,10],
//       labels: ["BB_940", "BB_941", "BB_942", "BB_943"],
//       type: "pie"
//     }];
  
//     var layout = {
//       height: 600,
//       width: 800
//     };
  
//     Plotly.plot("pie", data, layout);
//   }
  
  // function optionchanged(dataName) {
  //     var data = [];
  //     url="/samples/"+dataName;
  //   //take the dataName and grab the data in the "/samples/dataName' page
  //   //store data in data array--from Sample Value
  //   //store the out_id names in the "labels"
  //   //probably call the updatePlotly(arraySentHere)
  //   Plotly.d3.json(url, function(error, response) {

  //       if (error) return console.warn(error);
    
  //       // Grab values from the response json object to build the plots
  //       // var name = response.dataset.name;
  //       // var stock = response.dataset.dataset_code;
  //       // var startDate = response.dataset.start_date;
  //       // var endDate = response.dataset.end_date;
  //       var data = unpack(response.dataset, 0);
  //       //var data = unpack(response,0);
  //       var labels = unpack(response.dataset, 1);
  //       //var labels = response[1];
    
  //       // var trace1 = {
  //       //   type: "scatter",
  //       //   mode: "lines",
  //       //   name: name,
  //       //   x: dates,
  //       //   y: closingPrices,
  //       //   line: {
  //       //     color: "#17BECF"
  //       //   }
  //       // };
    
  //       // var data = [trace1];
    
  //   updatePlotly(data);
  //   });
  // }

//bring in new data to make the update
function updatePlotly(sampleData, otuData) {

    var sampleValues = sampleData[0]['sample_values'];
    var otuIDs = sampleData[0]['otu_ids'];

    // Needed help with this part
    var labels = otuIDs.map(function(item) {
        return otuData[item]
    });

    var BUBBLE = document.getElementById('bubble');
    Plotly.restyle(BUBBLE, 'x', [otuIDs]);
    Plotly.restyle(BUBBLE, 'y', [sampleValues]);
    Plotly.restyle(BUBBLE, 'text', [labels]);
    Plotly.restyle(BUBBLE, 'marker.size', [sampleValues]);
    Plotly.restyle(BUBBLE, 'marker.color', [otuIDs]);

    var PIE = document.getElementById('pie');
    var pieUpdate = {
        values: [sampleValues.slice(0, 10)],
        labels: [otuIDs.slice(0, 10)],
        hovertext: [labels.slice(0, 10)],
        hoverinfo: 'hovertext',
        type: 'pie'
    };
    Plotly.restyle(PIE, pieUpdate);
}


  
  function getData(sample, callback) {
    Plotly.d3.json(`/samples/${sample}`, function(error, sampleData) {
      if (error) return console.warn(error);

      Plotly.d3.json('/otu', function(error, otuData) {
          if (error) return console.warn(error);
          callback(sampleData, otuData);
      });
  });

  Plotly.d3.json(`/metadata/${sample}`, function(error, metaData) {
      if (error) return console.warn(error);

      updateMetaData(metaData);
  })
  }
  
init();
  


  function updateMetaData(data) {

    // Reference to Panel element for sample metadata
    var placement = document.getElementById("sample-metadata");

    // Clear any existing metadata
    placement.innerHTML = '';

    // Loop through all of the keys in the json response and
    // create new metadata tags
    for(var key in data) {
        h6tag = document.createElement("h6");
        h6Text = document.createTextNode(`${key}: ${data[key]}`);
        h6tag.append(h6Text);

        placement.appendChild(h6tag);
    }
}

function buildPlotly(sampleData, otuData) {

    var labels = sampleData[0]['otu_ids'].map(function(item) {
        return otuData[item]
    });

    var bubbleLayout = {
        margin: { t: 0 },
        hovermode: 'closest',
        xaxis: { title: 'OTU ID' }
    };
    var bubbleData = [{
        x: sampleData[0]['otu_ids'],
        y: sampleData[0]['sample_values'],
        text: labels,
        mode: 'markers',
        marker: {
            size: sampleData[0]['sample_values'],
            color: sampleData[0]['otu_ids'],
            // colorscale: "Earth",
        }
    }];
    var BUBBLE = document.getElementById('bubble');
    Plotly.plot(BUBBLE, bubbleData, bubbleLayout);

    var pieData = [{
        values: sampleData[0]['sample_values'].slice(0, 10),
        labels: sampleData[0]['otu_ids'].slice(0, 10),
        //find how to make hover
        hovertext: labels.slice(0, 10),
        hoverinfo: 'hovertext',
        type: 'pie'
    }];

    var pieLayout = {
        margin: { t: 0, l: 0 }
    };

    var PIE = document.getElementById('pie');
    Plotly.plot(PIE, pieData, pieLayout);
};



// function getData(sample, callback) {
//     // Use a request to grab the json data needed for all charts
//     Plotly.d3.json(`/samples/${sample}`, function(error, sampleData) {
//         if (error) return console.warn(error);

//         Plotly.d3.json('/otu', function(error, otuData) {
//             if (error) return console.warn(error);
//             callback(sampleData, otuData);
//         });
//     });

//     Plotly.d3.json(`/metadata/${sample}`, function(error, metaData) {
//         if (error) return console.warn(error);

//         updateMetaData(metaData);
//     })

//     // BONUS - Build the Gauge Chart
//     buildGauge(sample);
// }

function getOptions() {

    // selDataset found in html
    var selector = document.getElementById('selDataset');
//also done in html
    // Plotly.d3.json('/names', function(error, sampleNames) {
    //     for (var i = 0; i < sampleNames.length;  i++) {
    //         var currentOption = document.createElement('option');
    //         currentOption.text = sampleNames[i];
    //         currentOption.value = sampleNames[i]
    //         selector.appendChild(currentOption);
    //     }

    var url = "/names";
    Plotly.d3.json(url, function (error, response) {

        console.log(response);

        var data = response;
        console.log(data);
    });

    var samp_names = [];
    url = "/names";
    //url="http://localhost:500/names"

    Plotly.d3.json(url, function (error, response) {

        if (error) return console.warn(error);
        let dropDowm = ''
        console.log(Object.keys(response))
        response['sample names'].forEach(element => {
            let strEl = `<option value="results">${element}</option>`
            dropDowm += strEl
        });

        $('#selDataset').append(dropDowm)
        //samp_names=[response.data];
        // samp_names=[response["sample names"]][0];
        // console.log(samp_names)
        // console.log(5)
    });

    // Grab values from the response json object to build the plots
    // var name = response.dataset.name;


    // Function for displaying 
    function render() {

        // Looping through the array of presidents
        for (var i = 0; i < samp_names.length; i++) {
            console.log("hi");

            // Then dynamicaly generating buttons for each movie in the array.
            //var a = d3.select("#selDataset").append("option");
            // Adding a class
            d3.select("#selDataset").append("option");
            // Setting the text of the HTML <h2> element to be the president's name
            //a.text(samp_names[i]);
        }
    }

    // Call the function to render the page.

    render();

        //getData(sampleNames[0], buildPlotly);
        getData(samp_names[0], buildPlotly());
    })
}

function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    getData(newSample, updateCharts);
}

function init() {
    getOptions();
}

// Initialize the dashboard
init();
