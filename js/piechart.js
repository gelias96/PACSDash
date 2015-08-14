// PIE CHART onclick and update functions
var updatePie;
$(document).ready(function() {

  $("[name='pie']").click(function() { 
	var showCombined;
	var pieView;  
	if (myChart.getChartType() == 'PieChart') {
		if ($(this).attr('showCombined') == "yes") {
			showCombined = true;
		} else {
			showCombined=false;
		}	
		if ($(this).attr('dataToKey') == 'study-count') {
			myChart.setOption('title','Total Study Count')
			pieView = 2;	
		} else {
			myChart.setOption('title','Total Pixel Volume (GB)')
			pieView = 3;
		}
		google.visualization.events.removeListener(drawOnReady); 
		drawOnReady = google.visualization.events.addListener(dashboard,'ready', function() {
			  updatePie(pieView, showCombined) 
		})			  
		updatePie(pieView, showCombined)
		return;	
	}
	myChart = new google.visualization.ChartWrapper({
		'chartType': 'PieChart',
		'containerId': 'chart_div',
		'options': {
		  'backgroundColor': {'stroke': '#CC9900', 'strokeWidth': .85, 'fill': '#E6E6E8'},
		  'chartArea':{'width': '100%', 'height': '90%', 'top':20, 'left': 35},
		  'pieSliceText': 'value',
		  'legend': 'right',
		  'pieSliceBorderColor': '#8F8F8F',
		  'sliceVisibilityThreshold': .001/360
		  }
	})
	if ($(this).attr('dataToKey') == 'study-count') {
		myChart.setOption('title','Total Study Count')
		pieView = 2;	
	} else {
		myChart.setOption('title','Total Pixel Volume (GB)')
		pieView = 3;
	}				

	// Remove event for past chart and set for new chart.
	google.visualization.events.removeListener(drawOnReady); 
	drawOnReady = google.visualization.events.addListener(dashboard,'ready', function() {
		updatePie(pieView, showCombined) 
	})

	google.visualization.events.addOneTimeListener(myChart, 'ready', function() {
		// Bind 'select' event listeners
		// When a value on the chart is selected, set the selection on the table and vice versa.
		google.visualization.events.addListener(myTable, 'select', function() {
			myChart.getChart().setSelection(myTable.getChart().getSelection());
		})
		google.visualization.events.addListener(myChart, 'select', function() {
			myTable.getChart().setSelection(myChart.getChart().getSelection());
		})
	})

	// Reset setting of column chart
	$('#chart_div2').css('display', 'none');
	$('#chart_div').css('width', '100%');
	$('#table_div').css('display', 'none');
	$('#table_div2').css('display', ''); 
	$('#scatter-trendline').css('display','none');										        								        		       		
						
	// Hide options and information
	$('.information').css('display','none');   // Same with optional information
	$('#info1').css('display','');	
							
	if ($(this).attr('showCombined') == "yes") {
		showCombined = true;				
	} else {
		showCombined = false;
	}

	updatePie(pieView, showCombined)
  }); 

  updatePie = function (n, combo) {

	var tableView = tableChart.getDataTable();
	var pieData;
	if (tableView.getNumberOfRows() == 0) {
	  if (!(myChart.getChart() == null)) {
		myChart.getChart().clearChart();
		myTable.getChart().clearChart();
	  }
	  $('#info1').html("<b><i>No data to graph</i></b>");					
	  return;
	} else {
		if (combo) {
			$('#info1').html("<i>Sources shown combined.</i>");   										
		} else {
			$('#info1').html("<i>Sources shown separate.</i>");    														
		}
	}					
	if (!(combo)) {
		pieData = google.visualization.data.group(tableView, [1,4],[{'column': n, 'aggregation': google.visualization.data.sum, 'type': 'number'}]);
		pieData.If[2].label = "Total " + pieData.If[2].label
		var numRows = pieData.getNumberOfRows();
		for (var i=numRows; i--;) {
			pieData.Lf[i].c[0].v = 	pieData.Lf[i].c[0].v + " " + pieData.Lf[i].c[1].v
		}
		myChart.setView({columns: [0,2]})		
		if (n==2) {			
			numberFormatter.format(pieData, 2);
		} else {
			numberFormatter2.format(pieData, 2);
		}							
	} else {
		pieData = google.visualization.data.group(tableView, [1],[{'column': n, 'aggregation': google.visualization.data.sum, 'type': 'number'}]);
		pieData.If[1].label = "Total " + pieData.If[1].label					  
		numberFormatter.format(pieData, 1);
		myChart.setView({columns: [0,1]});	
		if (n==2) {			
			numberFormatter.format(pieData, 1);
		} else {
			numberFormatter2.format(pieData, 1);
		}				
	}
	myChart.setDataTable(pieData)
	myTable.setDataTable(pieData)
	myTable.draw()
	myChart.draw()		
  }
})