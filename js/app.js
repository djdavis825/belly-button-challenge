// populates metadata
function demoInfo(sample)
{
    // d3.json to get data
    d3.json("samples.json").then((data) => {
        // grab metadata
        let metaData = data.metadata;

        // filter
        let result = metaData.filter(sampleResult => sampleResult.id == sample);

        // index 0
        let resultData = result[0];

        // clear metadata
        d3.select("#sample-metadata").html("");

        // get value key pairs
        Object.entries(resultData).forEach(([key, value]) =>{
            // add to sample data/demo section
            d3.select("#sample-metadata")
                .append("h5").text(`${key}: ${value}`);
        });
    });
}

// builds graphs
// build bar chart
function buildBarChart(sample)
{
    d3.json("samples.json").then((data) => {
        // grab samples
        let sampleData = data.samples;
        
        // filter
        let result = sampleData.filter(sampleResult => sampleResult.id == sample);
        
        // index 0
        let resultData = result[0];

        // otu ids
        let otu_ids = resultData.otu_ids;
        let otu_labels = resultData.otu_labels;
        let sample_values = resultData.sample_values;

        // y ticks
        let yticks = otu_ids.slice(0, 10).map(id => `OTU ${id}`);
        let xValues = sample_values.slice(0, 10);
        let textLabels = otu_labels.slice(0, 10);

        // bar chart
        let barChart = {
            y: yticks.reverse(),
            x: xValues.reverse(),
            text: textLabels.reverse(),
            type: "bar",
            orientation: "h"
        }

        let layout = {
            title: "Top 10 Belly Button Bacteria"
        };

        Plotly.newPlot("bar", [barChart], layout);

    });
}

// build bubble chart
function buildBubbleChart(sample)
{
    d3.json("samples.json").then((data) => {
        // grab samples
        let sampleData = data.samples;
        
        // filter
        let result = sampleData.filter(sampleResult => sampleResult.id == sample);
        
        // index 0
        let resultData = result[0];

        // otu ids
        let otu_ids = resultData.otu_ids;
        let otu_labels = resultData.otu_labels;
        let sample_values = resultData.sample_values;

        // bubble chart

        let bubbleChart = {
            y: sample_values,
            x: otu_ids,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        }

        let layout = {
            title: "Bacteria Cultures Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"}
        };

        Plotly.newPlot("bubble", [bubbleChart], layout);

    });
}

// initialize dashboard
function initialize()
{
    //dropdown selector
    var select = d3.select("#selDataset");

    // d3.json to get data
    d3.json("samples.json").then((data) => {
        let sampleNames = data.names;

        // foreach to create sample options
        sampleNames.forEach((sample) => {
            select.append("option")
                .text(sample)
                .property("value", sample);
        });

        // pass first sample
        let sample1 = sampleNames[0];
        // call function
        demoInfo(sample1);
        // build bar chart   
        buildBarChart(sample1);
        // build bubble chart
        buildBubbleChart(sample1);
    });
}

// updates dashboard
function optionChanged(item)
{
    demoInfo(item);
    buildBarChart(item);
    buildBubbleChart(item);
}

// intialize function
initialize();