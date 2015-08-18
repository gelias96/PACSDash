
/* var pacsdash = {
	data: null,
	dashboard: null,
	yearSlider: null,
	sourceSearcher: null,
	modalityCategory: null,
	studySlider: null,
	pixelSlider: null,
	tableChart: null,
	myTable: null,
	setData: function(dt){
		this.data = dt
	},
	getData: function(){
		return this.data;
	},
	setDashboard: function(db){
		this.dashboard = db;
	},
	getDashboard: function(){
		return this.dashboard;
	},
	setYearSlider: function(ys){
		this.yearSlider = ys;
	},
	getYearSlider: function(){
		return yearSlider;
	},
	setSourceSearcher: function(ss){
		this.sourceSearcher = ss;
	},
	getSourceSearcher: function(){
		return this.sourceSearcher;
	}			
};
*/
/*
function pacdash(parameter) {
	
	// Create the private var
	var data = null,
		self = this;
	self.parameter = parameter;
	
	// Public method that calls the handler
	// Returns parameter
	function getPrivate(parameter) {
		return self.parameter
	}
}
*/
// Load the Visualization API and the controls package.
google.load('visualization', '1.0', {'packages':['controls']});

// Set a callback to run when the Google Visualization API is loaded.
google.setOnLoadCallback(queryData);


///// ---------- To use with CSV, see below code
/*


google.setOnLoadCallback(drawDash);

function drawDash () {
	// grab the CSV
	$.get("file-with-csv.csv", function(csvString) {
		// transform the CSV string into a 2-dimensional array
		var arrayData = $.csv.toArrays(csvString, {onParseValue: $.csv.hooks.castToScalar});
    	var data = new google.visualization.arrayToDataTable(arrayData);
	
}



*/
///// ---------- End





function queryData() {
  //https://docs.google.com/spreadsheets/d/19bSn16vLVvvCCUBSoIMfaM4ZvE8vTQxHIzuKdUaT9Jk/edit?usp=sharing
  //https://docs.google.com/spreadsheets/d/19bSn16vLVvvCCUBSoIMfaM4ZvE8vTQxHIzuKdUaT9Jk/edit#gid=0
  // Create my data table.
  var query = new google.visualization.Query("https://docs.google.com/spreadsheets/d/19bSn16vLVvvCCUBSoIMfaM4ZvE8vTQxHIzuKdUaT9Jk/edit?usp=sharing");
  query.send(handleQueryResponse);
}

function handleQueryResponse(response) {
 if (response.isError()) {
   alert('Error in query:' + response.getMessage() + ' ' + response.getDetailedMessage());
 return;
  };

  // Get data to a DataTable
  data = response.getDataTable();


  // Create a dashboard.
  dashboard = new google.visualization.Dashboard(
  document.getElementById('container'));
  
  // used to compare arrays when using google methods that alphabetize values(which is not what I want) 
  correctOrder = [];
  correctOrder[0] = data.getValue(0,1)					
  var numModalities = data.getDistinctValues(1).length
  var row=1;				
  for (var i=1; i<numModalities; i++) {
	for (var j=correctOrder.length; j--;) {
		if (correctOrder[j] == data.getValue(row,1)) {
			i--;
			break;
		} else {							
			correctOrder[i] = data.getValue(row,1);
		}
	}
	row++
  }

  // Create format for displaying different columns of data
  numberFormatter = new google.visualization.NumberFormat({pattern: '##,###'});
  numberFormatter2 = new google.visualization.NumberFormat({pattern: '##,###.###'});
  numberFormatter3 = new google.visualization.NumberFormat({pattern: ''});
  
  numberFormatter.format(data, 2); // Apply formatter to study count
  numberFormatter2.format(data, 3); // Apply formatter to pixel volume


  // Create a range slider for year
  yearRangeSlider = new google.visualization.ControlWrapper({
	'controlType': 'NumberRangeFilter', // ** Note that this is a NumberRangeFilter - DateRangeFilter propogates error "column 0 is not a date." Cannot change data type to 'date' 
	'containerId': 'year-filter-div',
	'options': {
	  'filterColumnLabel': 'Year',
	  'ui': {
		'label': 'Year',
		'labelStacking': 'vertical',
		'format': {'pattern': ''}
	  }
	}
  });

  // Create a category filter for the source
  sourceSearcher = new google.visualization.ControlWrapper({
	'controlType': 'CategoryFilter',
	'containerId': 'source-filter-div',
	'state': {
	  'selectedValues': ['Internal','External']},
	'options': {
	  'filterColumnLabel': 'Source',
	  'ui': {
		'label': 'Source',
		'labelStacking': 'vertical',
		'caption': 'Filter source...',
		'selectedValuesLayout': 'below'  
	   }
	 }
  });

  // Create a category filter for modality
  modalityCategory = new google.visualization.ControlWrapper({
	'controlType': 'CategoryFilter',
	'containerId': 'category-filter-div',
	'state': {
	  'selectedValues': [   
		'CR','CT','CTPT','MG','MR','MRPT','NM','PT','RF','US','XA','OT'
	  ]},
	'options': {
	  'filterColumnLabel': 'Modality',
	  'ui': {
		'label': 'Modality',
		'labelStacking': 'vertical',
		'caption':'Filter modality...',
		'selectedValuesLayout': 'below'         	    
	   }
	 }   

  });

  // Create a number range slider for Study Count and Pixel Volume
  studyRangeSlider = new google.visualization.ControlWrapper({
	'controlType': 'NumberRangeFilter',
	'containerId': 'study-filter-div',
	'options': {
	  'filterColumnLabel': 'Study Count',
	  'ui': {
		'label': 'Study Count',
		'labelStacking': 'vertical',
		'format': {'pattern':'##,###'}    // I want to get study count to appear w/out a decimal point
	  }
	}
  });

  pixelRangeSlider = new google.visualization.ControlWrapper({
	'controlType': 'NumberRangeFilter',
	'containerId': 'pixel-filter-div',
	'options': {
	  'filterColumnLabel': 'Pixel Volume(GB)',
	  'ui': {
		'label': 'Pixel Volume',
		'labelStacking': 'vertical',
		'format': {'pattern': '##,###'},
		'step': .1 
	  }
	}
  });

  // Create a table chart
  tableChart = new google.visualization.ChartWrapper({
	'chartType': 'Table',
	'containerId': 'table_div',
	'options': {
	  'width': '100%',
	  'height': '100%',
	  'showRowNumber': 'true',
	  'legend': 'right'
	},
	'view': {'columns': [0,1,2,3,4,5]}
  });

  myTable = new google.visualization.ChartWrapper({
	'chartType': 'Table',
	'containerId': 'table_div2',
	'options': {
	  'width': '100%',
	  'height': '100%',
	  'showRowNumber': 'true',
	  'legend': 'right'
	}
  });									        											

  // Create a pie chart on dashboards 'ready' event. Make it a variable so I can remove it easily.
  google.visualization.events.addOneTimeListener(dashboard,'ready',function() {
	  var showCombined;
	  var pieView;
	  var tableView = tableChart.getDataTable();
	  var pieData = google.visualization.data.group(tableView, [1],[{'column': 2, 'aggregation': google.visualization.data.sum, 'type': 'number'}]);
	  numberFormatter.format(pieData, 1); // Apply formatter to study count
	  myChart = new google.visualization.ChartWrapper({
		  'chartType': 'PieChart',
		  'containerId': 'chart_div',
		  'dataTable': pieData,
		  'options': {
			'title': 'Total Study Count',
			'backgroundColor': {'stroke': '#CC9900', 'strokeWidth': .85, 'fill': '#E6E6E8'},
			'chartArea':{'width': '100%', 'height': '90%', 'top':20, 'left': 35},
			'pieSliceText': 'value',
			'legend': 'right',
			'pieSliceBorderColor': '#8F8F8F',
			'sliceVisibilityThreshold': .001/360
			}
	  })

	  $('#info1').css('display','');

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
	
	  pieView = 2;
	  showCombined = true;				

	  drawOnReady = google.visualization.events.addListener(dashboard, 'ready', function() {
		  updatePie(pieView, showCombined)
	  }) 

	  updatePie(pieView, showCombined);
  }); 

//------------------------** PIE CHART **------------------------------------------------------------

//------------------------** SCATTER CHART **------------------------------------------------------------

//------------------------** COLUMN CHART **------------------------------------------------------------
	
  // Establish dependencies
  dashboard.bind([yearRangeSlider, sourceSearcher, modalityCategory, studyRangeSlider, pixelRangeSlider],[tableChart]);

  // Draw the dashboard.
  dashboard.draw(data); 
  
  runBootstrap(data);     	

} 