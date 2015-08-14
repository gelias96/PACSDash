//COLUMN CHART onclick and update functions
var updateColumn;
$(document).ready(function() {

  $("[name='column']").click(function () {
	var columnView;
	if (myChart.getChartType() == 'ColumnChart') {
		if ($(this).attr('dataToKey') == 'study-count') {
			myChart.setOption('title','Internal vs. External: Study Count over time')
			myChart.setOption('vAxis.title','Study Count')
			columnView = 2;
		} else {
			myChart.setOption('title', 'Internal vs. External: Pixel Volume over time')
			myChart.setOption('vAxis.title','Pixel Volume in Gigabytes')					
			columnView = 3;					
		}
		google.visualization.events.removeListener(drawOnReady); 
		drawOnReady = google.visualization.events.addListener(dashboard,'ready', function() {
			  updateColumn(columnView) 
		})			  					
		updateColumn(columnView);				
		return;
	}
	myChart = new google.visualization.ChartWrapper({
		'chartType': 'ColumnChart',
		'containerId': 'chart_div',
		'options': {
		  'backgroundColor': {'stroke': '#CC9900', 'strokeWidth': .85, 'fill': '#E6E6E8'},  	
		  'chartArea': {'height': '82%', 'width': '90%'},
		  'hAxis': {'title': 'Year', 'slantedText': false},					  					  
		  'vAxis': {'textPosition':'in'},
		  'legend': {'position':'in', 'alignment': 'end'},
		  'enableInteractivity':true
		 }
	})

	myChart2 = new google.visualization.ChartWrapper({
		'chartType': 'ColumnChart',
		'containerId': 'chart_div2',
		'options': {
		  'backgroundColor': {'stroke': '#CC9900', 'strokeWidth': .85, 'fill': '#E6E6E8'},  						
		  'title': 'Grand total',
		  'chartArea': {'height': '90%', 'width': '85%'},
		  'vAxis': {'textPosition':'in'},
		  'tooltip': {'textStyle' : {'bold': true, 'fontSize': 11.5}}
		 }
	})

	// Remove event for past chart and set for new chart.
	google.visualization.events.removeListener(drawOnReady); 
	drawOnReady = google.visualization.events.addListener(dashboard,'ready', function() {
		updateColumn(columnView) 
	})

	// Bind 'select' event listeners myTable and myChart				
	google.visualization.events.addOneTimeListener(myChart, 'ready', function() { 				
		google.visualization.events.addListener(myTable, 'select', function() {
			myChart.getChart().setSelection([{row:myTable.getChart().getSelection()[0].row, column: [1]}]);
		})		
		google.visualization.events.addListener(myChart, 'select', function() {
			myTable.getChart().setSelection([{row: myChart.getChart().getSelection()[0].row}]);
		})
	})

	$('#chart_div').css('width', '78%');
	$('#chart_div2').css('width', '22%');
	$('#chart_div2').css('display', '');  
	$('#table_div').css('display', 'none');
	$('#table_div2').css('display', '');
	$('#scatter-trendline').css('display','none');										        		

	var columnView;
	if ($(this).attr('dataToKey') == 'pixel-volume') {
		myChart.setOption('title', 'Internal vs. External: Pixel Volume over time')
		myChart.setOption('vAxis.title','Pixel Volume in Gigabytes')
		columnView = 3;					
	} else {
		myChart.setOption('title','Internal vs. External: Study Count over time')
		myChart.setOption('vAxis.title','Study Count')
		columnView = 2;				
	}

	updateColumn(columnView)
  });


  updateColumn = function (n) {
	var tableView = tableChart.getDataTable();

	// ** Internal vs. External over time **
	var columnDataOverTime = google.visualization.data.group(tableView, [0,4],[{'column': n, 'aggregation': google.visualization.data.sum, 'type': 'number'}]);
	var years = columnDataOverTime.getDistinctValues(0);
	var yearLength = years.length;
	// Check if there's data to graph
	if (yearLength == 0) {
		if (!(myChart.getChart() == null)) {
		  myChart.getChart().clearChart();
		  myChart2.getChart().clearChart();
		  myTable.getChart().clearChart();
		}
		$('#info1').html("<b><i> No data to graph</i></b>");    
		$('#info1').css('display','');					  
		return;	
	}
	$('.information').css('display','none');

	var columnArray = [[]];
	var src = columnDataOverTime.getDistinctValues(1);
	var srcLength = src.length;
	//Name columns
	columnArray[0][0] = "Year";
	columnArray[0][1] = "Total " + src[0];   // forces 'External' ahead of 'Internal' since method getDistinctValues() places alphabetically
	if (srcLength > 1) {
		var row=1;
		for (var i=2; i<=srcLength; i++) {
			for (var j=columnArray[0].length; j--;) {
				if (columnArray[0][j] == columnDataOverTime.getValue(row,1)) {
					i--;
					break;
				} else {
					columnArray[0][i] = "Total " + columnDataOverTime.getValue(row,1);
				}					
			}
			row++;
		}
	}
	//Populate rows
	for (var i=yearLength; i--;) {
		columnArray[i+1] = [];
		columnArray[i+1][0] = years[i]; 
	}
	var i = 1;
	var rows = columnDataOverTime.getNumberOfRows();			
	for (var j=0; j < rows;) {
		for (p=1; p<=srcLength; p++) {
			if ((columnArray[0][p] == ("Total " + columnDataOverTime.getValue(j, 1))) && (columnArray[i][0] == columnDataOverTime.getValue(j, 0))) {
				columnArray[i][p] = columnDataOverTime.getValue(j, 2);
				j++;
			} else {
				columnArray[i][p] = null;
			}
		}
		i++;
	}

	// ** Internal vs. External total **
	var columnDataTotal = google.visualization.data.group(tableView, [4],[{'column': n, 'aggregation': google.visualization.data.sum, 'type': 'number'}]);			

	var columnDataTableOverTime = google.visualization.arrayToDataTable(columnArray);
	
	// Format Data	
	if (n==2) {
		for (var i=srcLength; i--;) {
		numberFormatter.format(columnDataTableOverTime, i+1)	
		}
		pattern = '##,###';					
		numberFormatter.format(columnDataTotal, 1)
	} else {
		for (var i=srcLength; i--;) {
		numberFormatter2.format(columnDataTableOverTime, i+1)	
		}
		numberFormatter2.format(columnDataTotal, 1)
		pattern = '##,###.##';					
	}
	numberFormatter3.format(columnDataTableOverTime, 0);
	columnDataTableOverTime.If[0].pattern = "####"; // Number formatter is not working; it shows the formatted value in the actual data, but not on the graph. This does is manually.				

	// Add tooltip column to avoid cutting text off. Add style column to assign different colors
	columnDataTotal.addColumn({type: 'number', role:'tooltip', pattern: pattern});
	columnDataTotal.addColumn({type: 'string', role:'style'});
	var colors= ['blue','red','green','yellow']; // initialize color array for up to 4 sources
	var j=0;
	for (var i=columnDataTotal.getNumberOfRows(); i--;) {
		columnDataTotal.setCell(j, 3, 'color:' + colors[j]);
		columnDataTotal.setCell(i, 2, columnDataTotal.getValue(i,1), columnDataTotal.Lf[i].c[1].f);									
		j++;
	}

	myChart2.setDataTable(columnDataTotal)
	myChart.setDataTable(columnDataTableOverTime)
	myTable.setDataTable(columnDataTableOverTime)
	myChart2.draw()
	myChart.draw()
	myTable.draw()		
  }
})