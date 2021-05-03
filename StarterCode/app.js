//creating function init
function init() {
        
        //reading the data from samples.json
        d3.json("samples.json").then((data)=> {
        console.log(data);

        //getting the id into the dropdown menu
        data.names.forEach((name) => {
            d3.select("#selDataset")
            .append("option")
            .text(name)
            .property("value");
        });

        plots(data.names[0]);
        demogInfo(data.names[0]);
    });
};
init();


//creating function demogInfo from data to demographic info
function demogInfo(id){
        
        d3.json("samples.json").then((data)=> {
        var metadata = data.metadata;
        //console.log(metadata);

        //filtering data by id in demographic info
        var filterResult = metadata.filter(info => info.id.toString() === id)[0];

        var panelBody = d3.select("#sample-metadata");

        //empty the demographic info panel
        panelBody.html("");

        Object.entries(filterResult).forEach((key)=>{
            panelBody.append("p").text(key[0] + ":" + key[1]);
        });
    });
};

//creating function to prepare plots
function plots(id) {
    
        //reading the data from samples.json
        d3.json("samples.json").then((data)=> {
        //console.log(data)
        
        //filtering wfreq by id
        var wfreq = data.metadata.filter(f => f.id.toString() === id)[0];
        wfreq = wfreq.wfreq;
        console.log("Wfreq: " + wfreq);
        
        //filtering samples by id 
        var samples = data.samples.filter(s => s.id.toString() === id)[0];
        
        //selecting top 10 sample values and reversing it
        var samplevalues = samples.sample_values.slice(0, 10).reverse();
        console.log("top 10 sample values: " + samplevalues);
  
        //selecting top 10 otu ids and reversing it 
        var OTU = (samples.otu_ids.slice(0, 10)).reverse();
        
        //selecting otu id's to the desired form for the plot
        var OTU_id = OTU.map(d => "OTU " + d)
  
        console.log("OTU IDS: " + OTU_id);
  
        //selecting top 10 labels and reversing it
        var labels = samples.otu_labels.slice(0, 10).reverse();
        console.log("labels: " + labels);
  
        //-------------the bar chart

        //creating trace for the bar chart
        var trace = {
            x: samplevalues,
            y: OTU_id,
            text: labels,
            marker: {
              color: "Blue"},
            type:"bar",
            orientation: "h",
        };
  
        //creating data variable
        var data = [trace];
  
        //creating plot layout
        var layout = {
            height: 500,
            width: 600,
            font: {
                family: "Quicksand"
            },

            title: {
                text: "<b>Top 10 OTU´s</b>",
                font: {
                    size: 18,
                    color: "black"
                }
            },
            xaxis: {
                title: "<b>Sample values<b>",
                color: "black"
                }
            }

        //creating bar plot
        Plotly.newPlot("bar", data, layout);
      

        // -------------the gauge chart
        var data_gauge = [
            {
            domain: { x: [0, 1], y: [0, 1] },
            value: wfreq,
            title: {text:"Belly Button Washing Frequency"},
            type: "indicator",
            mode: "gauge+number",
            
            gauge: { axis: { range: [null, 9] },
                     steps: [
                      {range: [0, 1], color: "rgb(255,255,217)"},
                      {range: [1, 2], color: "rgb(237,248,217)"},
                      {range: [2, 3], color: "rgb(199,233,180)"},
                      {range: [3, 4], color: "rgb(127,205,187)"},
                      {range: [4, 5], color: "rgb(65,182,196)"},
                      {range: [5, 6], color: "rgb(29,145,192)"},
                      {range: [6, 7], color: "rgb(34,94,168)"},
                      {range: [7, 8], color: "rgb(37,52,148)"},
                      {range: [8, 9], color: "rgb(8,29,88)"}
                    ]}
                
            }
          ];
          var layout_gauge = { 
              width: 700, 
              height: 600, 
              margin: { t: 20, b: 40, l:100, r:100 } 
            };
          Plotly.newPlot("gauge", data_gauge, layout_gauge);

        // ------------- the bubble chart
        var trace1 = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids,
               
            },
            text: samples.otu_labels
  
        };
  
        //setting the layout for bubble plot
        var layout_bubble = {
            xaxis:{title: "OTU ID"},
            height: 600,
            width: 1200

        };
  
        //creating data variable 
        var data1 = [trace1];
  
        //create the bubble plot
        Plotly.newPlot("bubble", data1, layout_bubble); 
  
    });
  }  


//change event function
function optionChanged(id){
    plots(id);
    demogInfo(id);
};