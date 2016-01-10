//SCATTER CHART onclick and update functions
var updateScatter;
$(document).ready(function() {
  $("[name='scatter']").click(function(){
	var showCombined;
	var scatterView;
	if (myChart.getChartType() == 'ScatterChart') {
		if ($(this).attr('showCombined') == "yes") {					
			showCombined = true;
			$('#table_div2').css('display', '');
			$('#table_div').css('display', 'none');					  		  					  
		} else {
			showCombined = false;
			$('#table_div').css('display', '');
			$('#table_div2').css('display', 'none');						          						  
		}
		if ($(this).attr('dataToKey') == 'study-count') {
			myChart.setOption('title','Study Count vs. Year')
			myChart.setOption('vAxis.title','Study Count')
			scatterView = 2;
		} else {
			myChart.setOption('title', 'Pixel Volume vs. Year')
			myChart.setOption('vAxis.title','Pixel Volume in Gigabytes')
			scatterView = 3;					
		} 
		google.visualization.events.removeListener(drawOnReady); 
		drawOnReady = google.visualization.events.addListener(dashboard,'ready',function() {
			  updateScatter(scatterView, showCombined)
		})			  
		 updateScatter(scatterView, showCombined);
		 addScatterEvents(showCombined);
		 return;
	}
  
	myChart = new google.visualization.ChartWrapper({
		  'chartType': 'ScatterChart',
		  'containerId': 'chart_div',
		  'options': {
			'backgroundColor': {'stroke': '#CC9900', 'strokeWidth': .85, 'fill': '#E6E6E8'},  	
			'chartArea':{'width': '93%', 'height': '80%'},
			'explorer': {},     // Provides 'scroll to zoom' and 'drag to pan'. Cannot modify 'maxZoom' or 'zoomDelta'. This feature may change in future releases
			'hAxis': {
				'format': '####',
				'title': 'Year',
				'baselineColor': 'black',
				'gridlines': {'count': 5},
				'minorGridlines':{'count': 1}
			},
			'vAxis': {
				'textPosition':'in', 
				'baselineColor': 'black', 
				'format': '##,###',
				'gridlines': {'count': 10} 
			},
			'legend': {'alignment':'end', 'position':'top'},
			'tooltip': {'trigger': 'focus'}  
		  }
	})			

	if (trendlineOn) {
		var options = {0: { 					// Declare options.
			  'type': typeOfTrendline,
			  'labelInLegend': label,
			  'color': 'green',
			  'lineWidth': 2,
			  'opacity': 0.3,
			  'visibleInLegend': true
			}};
		$('#clear-trendline').css('display','')	
		myChart.setOption('trendlines', options);   // Pass options.
	} else {
		$('#clear-trendline').css('display','none')							
	}				

	if ($(this).attr('dataToKey') == 'study-count') {
		myChart.setOption('title','Study Count vs. Year')
		myChart.setOption('vAxis.title','Study Count')
		scatterView = 2;
	} else {
		myChart.setOption('title', 'Pixel Volume vs. Year')
		myChart.setOption('vAxis.title','Pixel Volume in Gigabytes')
		scatterView = 3;					
	}

	$('#chart_div2').css('display', 'none');
	$('#chart_div').css('width', '100%');	
	$('#table_div').css('display', 'none');
	$('#table_div2').css('display', 'none');				      				  						  	  				      				  			
	$('.information').css('display','none');           	// Reuse buttons with ID 'option1','option2',etc. Each time new graph is drawn, hide all buttons.
	$('#info1').css('display','');
	$('#scatter-trendline').css('display','');										
	
	if ($(this).attr('showCombined') == "yes") {
		showCombined = true;	
	} else {
		showCombined = false;
	}			
		
	// Remove event for past chart and set for new chart.
	google.visualization.events.removeListener(drawOnReady); 
	drawOnReady = google.visualization.events.addListener(dashboard,'ready',function() {
		updateScatter(scatterView, showCombined)
	})	
  
  
	updateScatter(scatterView, showCombined);
	addScatterEvents(showCombined);	
					  
  });


  var addScatterEvents = function(combo) {
		// Bind 'select' event listeners
		// When an aspect of the chart is selected, set the selection on the table and vice versa.
		if (!(combo)) {
			google.visualization.events.addListener(tableChart, 'select', function() {
				var selectedRow = tableChart.getChart().getSelection()[0].row
				var selectedYear = tableView.getValue(selectedRow,0)
				var columnHeading = tableView.getValue(selectedRow,1) + ' ' + tableView.getValue(selectedRow,4)
				var row;
				var column;
				var length1 = scatterArray[0].length;
				for (var i=length1; i--;) {
					if (scatterArray[0][i] == columnHeading){
						column = i;
						break;
					}
				}
				length2 = scatterArray.length;
				for (var i=length2; i--;) {
					if (scatterArray[i][0] == selectedYear) {
						row = i-1;
						break;
					}
				}
				myChart.getChart().setSelection([{row: row, column: column}])
			})

			google.visualization.events.addListener(myChart, 'select', function() {
				var selectedRow = myChart.getChart().getSelection()[0].row
				var selectedColumn = myChart.getChart().getSelection()[0].column
				var selectedYear = scatterArray[selectedRow+1][0]
				var headingArray = scatterArray[0][selectedColumn].split(" ")
				var row;
				var numRows = tableView.getNumberOfRows()
				for (i=numRows; i--;) {
					if ( (tableView.getValue(i,1) == headingArray[0]) && (tableView.getValue(i,4) == headingArray[1]) && (tableView.getValue(i,0) == selectedYear) ) {
						row = i;
						break;								
					}
				}

				tableChart.getChart().setSelection([{row: row}]);
			}) 
		} else {
			var tableView2 = scatterDataCombinedForTable;					  
			google.visualization.events.addListener(myTable, 'select', function() {
				var selectedRow = myTable.getChart().getSelection()[0].row
				var selectedYear = tableView2.getValue(selectedRow,0)
				var columnHeading = tableView2.getValue(selectedRow,1)
				var row;
				var column;
				var length1 = scatterArray[0].length;
				for (var i=length1; i--;) {
					if (scatterArray[0][i] == columnHeading){
						column = i;
						break;
					}
				}
				length2 = scatterArray.length;
				for (var i=length2; i--;) {
					if (scatterArray[i][0] == selectedYear) {
						row = i-1;
						break;
					}
				}
				myChart.getChart().setSelection([{row: row, column: column}])
			})			 		  	
			google.visualization.events.addListener(myChart, 'select', function() {
				var selectedRow = myChart.getChart().getSelection()[0].row
				var selectedColumn = myChart.getChart().getSelection()[0].column
				var selectedYear = scatterArray[selectedRow+1][0]
				var columnHeading = scatterArray[0][selectedColumn]
				var row;
				var numRows = tableView2.getNumberOfRows()
				for (i=numRows; i--;) {
					if ( (tableView2.getValue(i,1) == columnHeading) && (tableView2.getValue(i,0) == selectedYear) ) {
						row = i;
						break;								
					}
				}

				myTable.getChart().setSelection([{row: row}]);
			}) 					  
		}			  
  };     


  updateScatter = function(n, combo) {    
	var srcState = sourceSearcher.getState().selectedValues;
	var isInternal = false;
	var isExternal = false;
	var srcLength = srcState.length;
	for (var i=srcLength; i--;) {
		if (srcState[i]=="Internal") {
			isInternal = true;
		} else {
			isExternal = true;
		}
	}
	tableView = tableChart.getDataTable(); 
	var numRows = tableView.getNumberOfRows();			
	if (numRows == 0) {
	  $('#table_div').css('display', 'none');		
	  $('#table_div2').css('display', 'none');				  				    		  
	  if (!(myChart.getChart() == null)){				  	
		myChart.getChart().clearChart();
	  }
	  $('#info1').html("<b><i>No data to graph</i></b>");					
	  return;
	} else {
		if(combo) {
			$('#table_div2').css('display', '');				  				  					  					  					  		
			$('#info1').html("<i>Scroll to zoom and drag to pan. Right-click to reset. Sources shown combined.</i>");												
		} else {
			$('#table_div').css('display', '');				  				  					  					  
			$('#info1').html("<i>Scroll to zoom and drag to pan. Right-click to reset. Sources shown separate.</i>"); 														
		}
	}
	// Since google's aggregation functions("sum" is used for scatterDataCombined) alphabetize the resulting dataTable, 
	// I will have two different arrays of modalities. One is populated by the getDistinctValues method below. This alphabetizes the data as well, in the same order.
	// This array is used with modalitiesForCombined.
	// The other Array, modalitiesForSeparate, is populated via my own loop, since I am pulling values from tableView, which is not alphabetized.
	// The key difference between the two is the last five modalities: 
	// in modalitiesForCombined, they are in the order OT, PT, RF, US, XA;
	// in modalitiesForSeparate, they are in the order PT, RF, US, XA, OT.

	var modalitiesForCombined = tableView.getDistinctValues(1)
	var modalityLength = modalitiesForCombined.length;  // getDistinctValues() alphabetizes array. Run my own for loop to avoid this.				
	var modalitiesForSeparate = []; 
	if (modalityLength > 1 && !(combo)) {
		var correctOrder1 = correctOrder;	
		var index=modalityLength-1;
		for (var j = correctOrder1.length; j--;) {
		  for (var i = modalityLength; i--;) {								  
			  if (correctOrder1[j] == modalitiesForCombined[i]) {
				  modalitiesForSeparate[index] = correctOrder1[j];
				  index -- ;
				  break;
			  }
		  }
		}
	} else if (!(combo)) {
	  modalitiesForSeparate = [tableView.getValue(0,1)]
	}
	var years = tableView.getDistinctValues(0);
	scatterArray= [[]];
	scatterArray[0][0] = "Year"
	// name column headers with modalities.
	if (combo) {
		for (var j=0; j<modalityLength; j++) {
			scatterArray[0][j+1] = modalitiesForCombined[j]
			}
	} else {		
	  for (var j=0; j<modalityLength; j++) {
		if (isInternal) {
			scatterArray[0][j+1] = modalitiesForSeparate[j] + " Internal"
			if (isExternal) {
				scatterArray[0][j+1+modalityLength] = modalitiesForSeparate[j] + " External"
			}
		} else if (isExternal) {
			scatterArray[0][j+1] = modalitiesForSeparate[j] + " External"
		} else {
			return;
		}				
	  }
	}

	// populate rows
	var addForExternal = modalityLength;		
	var flag = true	; 
	var yearLength = years.length;
	// For showing the total of Internal and External 
	var scatterDataCombined;
	var scatterDataCombined2;
	if (combo) { 
		scatterDataCombined = google.visualization.data.group(tableView, [0,1],[{'column': n, 'aggregation': google.visualization.data.sum, 'type': 'number'}]);    			
		var row_index = scatterDataCombined.getNumberOfRows()-1;
		for (var i=yearLength; i--;) {
			scatterArray[i+1] = [];
			scatterArray[i+1][0] = years[i];
			for (var j=modalityLength; j--;) {
				if ((scatterArray[0][j+1] == scatterDataCombined.getValue(row_index,1)) && (scatterArray[i+1][0] == scatterDataCombined.getValue(row_index,0))) {
					scatterArray[i+1][j+1] = scatterDataCombined.getValue(row_index,2);
					row_index--;								
				} else {
					scatterArray[i+1][j+1] = null;					
				}
			}
		}
		if (n==2) {
			scatterDataCombined2 = google.visualization.data.group(tableView, [0,1],[{'column': 3, 'aggregation': google.visualization.data.sum, 'type': 'number'}]);    								  					  
			scatterDataCombinedForTable = google.visualization.data.join(scatterDataCombined, scatterDataCombined2, 'inner', [[0,0],[1,1]], [2], [2]);    								  					  						  
		} else {
			scatterDataCombined2 = google.visualization.data.group(tableView, [0,1],[{'column': 2, 'aggregation': google.visualization.data.sum, 'type': 'number'}]);    								  					  	
			scatterDataCombinedForTable = google.visualization.data.join(scatterDataCombined2, scatterDataCombined, 'inner', [[0,0],[1,1]], [2], [2]);    								  					  						  
		}
		numberFormatter.format(scatterDataCombinedForTable, 2);	
		numberFormatter2.format(scatterDataCombinedForTable, 3);								  				
	// For showing each separately 
	} else {  
		var row_index = numRows-1;						
		for (var p=srcLength; p--;) {
			if (p==0) {
				addForExternal=0;
			}
			for (var i=yearLength; i--;) {
				if (flag) {
					scatterArray[i+1] = [];
					scatterArray[i+1][0] = years[i]
				}
				for (var j=modalityLength; j--;) {
				  if (row_index != -1 ) {
					if (modalitiesForSeparate[j] == tableView.getValue(row_index,1)) { 
						if (scatterArray[i+1][0] == tableView.getValue(row_index,0)) {
							if ((scatterArray[0][j+1+addForExternal]).split(' ')[1] == tableView.getValue(row_index,4)) {
								scatterArray[i+1][j+1+addForExternal] = tableView.getValue(row_index,n);
								row_index--;																		
							} else {
								scatterArray[i+1][j+1+addForExternal] = null;					
							} 
						} else {
							scatterArray[i+1][j+1+addForExternal] = null;
						} 
					} else {
						scatterArray[i+1][j+1+addForExternal] = null;
					}
				  } else {
					  scatterArray[i+1][j+1+addForExternal] = null;
				  }
				}
			}
			flag = false;
		  }
		}
		var scatterDataTable = google.visualization.arrayToDataTable(scatterArray)
  
		// Format data, set type
		scatterDataTable.Ff[0].type = "number"
		if (n=2) {
			for (var i=modalityLength+1; i--;) {
				scatterDataTable.Ff[i].type = "number" 
				numberFormatter.format(scatterDataTable, i);
				if (!(combo)) {
					if (isExternal && isInternal) {
						scatterDataTable.Ff[i + modalityLength].type = "number" 
						numberFormatter.format(scatterDataTable, i+modalityLength);					
					}
				}
			}
		} else {
			for (var i=modalityLength+1; i--;) {
				scatterDataTable.Ff[i].type = "number"
				numberFormatter2.format(scatterDataTable, i);
				if (!(combo)) {
					if (isExternal && isInternal) {
						numberFormatter2.format(scatterDataTable, i+modalityLength)					
					}		
				}							
			}
		}
		numberFormatter3.format(scatterDataTable,0)
	// Set correct series colors
	var modalities;
	if (combo) {
		modalities = modalitiesForCombined;			
	} else {
		modalities = modalitiesForSeparate;
	}

	for (var i=modalityLength; i--;) {
		switch (modalities[i]) {
			case "CR":
				if (combo) {
					myChart.setOption('series.'+i+'.color', '#CC99FF')
					break;
				} else {
					if (isInternal) {
						if (isExternal) {
							myChart.setOption('series.'+i+'.color', '#CC99FF')
							myChart.setOption('series.'+(i + modalityLength)+'.color', '#CCC7FF')
						} else {
							myChart.setOption('series.'+i+'.color', '#CC99FF')
						}
					} else {
						myChart.setOption('series.'+i+'.color', '#CCC7FF')
					} break;
				}
			case "CT":
				if (combo) {
					myChart.setOption('series.'+i+'.color', '#5CAAB6')
					break;
				} else {
					if (isInternal) {
						if (isExternal) {
							myChart.setOption('series.'+i+'.color', '#5CAAB6')
							myChart.setOption('series.'+(i + modalityLength)+'.color', '#98C9D1')
						} else {
							myChart.setOption('series.'+i+'.color', '#5CAAB6')
						}
					} else {
						myChart.setOption('series.'+i+'.color', '#98C9D1')
					} break;
				}
			case "CTPT":
				if (combo) {
					myChart.setOption('series.'+i+'.color', '#43CC2C')
					break;
				} else {							
					if (isInternal) {
						if (isExternal) {
							myChart.setOption('series.'+i+'.color', '#43CC2C')
							myChart.setOption('series.'+(i + modalityLength)+'.color', '#B5EDA8')
						} else {
							myChart.setOption('series.'+i+'.color', '#43CC2C')
						}
					} else {
						myChart.setOption('series.'+i+'.color', '#B5EDA8')
					} break;
				}
			case "MG":
				if (combo) {
					myChart.setOption('series.'+i+'.color', '#F0C44C')
					break;
				} else {							
					if (isInternal) {
						if (isExternal) {
							myChart.setOption('series.'+i+'.color', '#F0C44C')
							myChart.setOption('series.'+(i + modalityLength)+'.color', '#FFDB94')
						} else {
							myChart.setOption('series.'+i+'.color', '#F0C44C')
						}
					} else {
						myChart.setOption('series.'+i+'.color', '#FFDB94')
					} break;	
				}					
			case "MR":
				if (combo) {
					myChart.setOption('series.'+i+'.color', '#F248BD')
					break;
				} else {							
					if (isInternal) {
						if (isExternal) {
							myChart.setOption('series.'+i+'.color', '#F248BD')
							myChart.setOption('series.'+(i + modalityLength)+'.color', '#F1AEE1')
						} else {
							myChart.setOption('series.'+i+'.color', '#F248BD')
						}
					} else {
						myChart.setOption('series.'+i+'.color', '#F1AEE1')
					} break;
				}					
			case "MRPT":
				if (combo) {
					myChart.setOption('series.'+i+'.color', '#7B83F0')
					break;
				} else {							
					if (isInternal) {
						if (isExternal) {
							myChart.setOption('series.'+i+'.color', '#7B83F0')
							myChart.setOption('series.'+(i + modalityLength)+'.color', '#A9BEF0')
						} else {
							myChart.setOption('series.'+i+'.color', '#7B83F0')
						}
					} else {
						myChart.setOption('series.'+i+'.color', '#A9BEF0')
					} break;	
				}				
			case "NM":
				if (combo) {
					myChart.setOption('series.'+i+'.color', '#26E5F0')
					break;
				} else {						
					if (isInternal) {
						if (isExternal) {
							myChart.setOption('series.'+i+'.color', '#26E5F0')
							myChart.setOption('series.'+(i + modalityLength)+'.color', '#DEFBFD')
						} else {
							myChart.setOption('series.'+i+'.color', '#26E5F0')
						}
					} else {
						myChart.setOption('series.'+i+'.color', '#DEFBFD')
					} break;
				}						
			case "PT":
				if (combo) {
					myChart.setOption('series.'+i+'.color', '#333EFD')
					break;
				} else {						
					if (isInternal) {
						if (isExternal) {
							myChart.setOption('series.'+i+'.color', '#333EFD')
							myChart.setOption('series.'+(i + modalityLength)+'.color', '#7C94FE')
						} else {
							myChart.setOption('series.'+i+'.color', '#333EFD')
						}
					} else {
						myChart.setOption('series.'+i+'.color', '#7C94FE')
					} break;	
				}				
			case "RF":
				if (combo) {
					myChart.setOption('series.'+i+'.color', '#FEF319')
					break;
				} else {						
					if (isInternal) {
						if (isExternal) {
							myChart.setOption('series.'+i+'.color', '#FEF319')
							myChart.setOption('series.'+(i + modalityLength)+'.color', '#FEFAA3')
						} else {
							myChart.setOption('series.'+i+'.color', '#FEF319')
						}
					} else {
						myChart.setOption('series.'+i+'.color', '#FEFAA3')
					} break;
				}						
			case "US":
				if (combo) {
					myChart.setOption('series.'+i+'.color', '#CBFA00')
					break;
				} else {
					if (isInternal) {
						if (isExternal) {
							myChart.setOption('series.'+i+'.color', '#CBFA00')
							myChart.setOption('series.'+(i + modalityLength)+'.color', '#EAFD99')
						} else {
							myChart.setOption('series.'+i+'.color', '#CBFA00')
						}
					} else {
						myChart.setOption('series.'+i+'.color', '#EAFD99')
					} break;	
				}				
			case "XA":
				if (combo) {
					myChart.setOption('series.'+i+'.color', '#22CC41')
					break;
				} else {
					if (isInternal) {
						if (isExternal) {
							myChart.setOption('series.'+i+'.color', '#22CC41')
							myChart.setOption('series.'+(i + modalityLength)+'.color', '#90E6A0')
						} else {
							myChart.setOption('series.'+i+'.color', '#22CC41')
						}
					} else {
						myChart.setOption('series.'+i+'.color', '#90E6A0')
					} break;
				}					
			case "OT":
				if (combo) {
					myChart.setOption('series.'+i+'.color', '#B438E9')
					break;
				} else {
					if (isInternal) {
						if (isExternal) {
							myChart.setOption('series.'+i+'.color', '#B438E9')
							myChart.setOption('series.'+(i + modalityLength)+'.color', '#E8C3F8')
						} else {
							myChart.setOption('series.'+i+'.color', '#B438E9')
						}
					} else {
						myChart.setOption('series.'+i+'.color', '#E8C3F8')
					} break;
				}
		}
	}
	if (combo) {
		myTable.setDataTable(scatterDataCombinedForTable);											
		myTable.draw();				  	
	}
	myChart.setDataTable(scatterDataTable);											
	myChart.draw();
  };
  var trendlineOn;
  var typeOfTrendline;
  var label;
  // Function to show trendline when selected		
  $('.scatter-trendline-option').click(function() {
	if ($(this).attr('name') == 'linear') {
		typeOfTrendline = 'linear';
		label = 'linear trend';
		trendlineOn = true;												
	} else if ($(this).attr('name') == 'polynomial') {
		typeOfTrendline = 'polynomial';
		label = 'polynomial trend';
		trendlineOn = true;																					
	} else if ($(this).attr('name') == 'exponential') {
		typeOfTrendline = 'exponential';
		label = 'exponential trend';
		trendlineOn = true;							
	} else {
		myChart.setOption('trendlines', {});
		trendlineOn = false;
		myChart.draw();
	}
	if (trendlineOn) {
		var options = {0: { 					// Declare options.
			  'type': typeOfTrendline,
			  'labelInLegend': label,
			  'color': 'green',
			  'lineWidth': 2,
			  'opacity': 0.3,
			  'visibleInLegend': true
			}};
		$('#clear-trendline').css('display','')	
		myChart.setOption('trendlines', options);   // Pass options.
		myChart.draw();               				// Redraw chart.
	} else {
		$('#info2').css('display','none');				  
		$('#clear-trendline').css('display','none')							
		}
  })
})