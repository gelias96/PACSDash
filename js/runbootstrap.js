var runBootstrap;
$(document).ready(function() {

  runBootstrap = function (dt) {
		$('#multiple-modalities').multiselect({
		  maxHeight: 160,
		  onChange: function (option, checked, select) {
			  var value = $(option).val();
			  if (value == 'select-all') {
				  if ($('#ui-category-filter-div option[value="select-all"]').html() == 'Select all') {
					  $('#multiple-modalities').multiselect('selectAll');
					  modalityCategory.setState({selectedValues: ['CR','CT','CTPT','MG','MR','MRPT','NM','PT','RF','US','XA','OT']});
					  $('#ui-category-filter-div option[value="select-all"]').html('Deselect all')
					  $('#ui-category-filter-div option[value="select-all"]').prop('selected', false);
				  } else {
					  $('#multiple-modalities').multiselect('deselectAll');
					  modalityCategory.setState({selectedValues: []});
					  $('#ui-category-filter-div option[value="select-all"]').html('Select all')															
				  }
				  $('#multiple-modalities').multiselect('updateButtonText');	
				  $('#multiple-modalities').multiselect('rebuild');
			  } else {
				  var selected = modalityCategory.getState().selectedValues;
				  if (checked) {
					  selected.push(value);
				  } else {
					  selected.splice(selected.indexOf(value), 1);
				  }
				  modalityCategory.setState({selectedValues: selected});
			  }			  		
			  modalityCategory.draw();
		  },
		  buttonWidth: '200px',
		  nonSelectedText: 'None selected',
		  allSelectedText: 'All modalities shown'
	  })
	  $('#multiple-sources').multiselect({
		  onChange: function (option, checked, select) {
			  var value = $(option).val();
				  var selected = sourceSearcher.getState().selectedValues;
			  if (checked) {
				  selected.push(value);
			  } else {
				  selected.splice(selected.indexOf(value), 1);
			  }
			  sourceSearcher.setState({selectedValues: selected});			  		
			  sourceSearcher.draw();
		  },
		  buttonWidth: '200px',
		  nonSelectedText: 'None selected',
		  allSelectedText: 'All sources shown'			  					 
	})
	var value;
	var max = dt.getColumnRange(2).max
	var min = dt.getColumnRange(2).min	
	  
	$('#study-span-left').html('<b>'+min+'</b>');
	$('#study-span-right').html('<b>'+max+'</b>');				  
	var studySlider = $("#ui-study-slider").slider({
	  min: min,
	  max: max,
	  step: 5,
	  value:[min, max],
	  tooltip: 'always'
	});

	studySlider.on('slideStop', function (newValue) {
	  studyRangeSlider.setState({lowValue: newValue.value[0], highValue: newValue.value[1]});
	  studyRangeSlider.draw();
	})			  	  	 
  
	max = dt.getColumnRange(3).max
	min = dt.getColumnRange(3).min
	$('#pixel-span-left').html('<b>'+min+'</b>');
	$('#pixel-span-right').html('<b>'+max+'</b>');		  		  		  
	var pixelSlider = $("#ui-pixel-slider").slider({
	  min: min,
	  max: max,
	  step: 5,
	  value:[min, max],
	  tooltip: 'always'		  	
	});		  
	pixelSlider.on('slideStop', function (newValue) {
	  pixelRangeSlider.setState({lowValue: newValue.value[0], highValue: newValue.value[1]});
	  pixelRangeSlider.draw();
	})

	max = dt.getColumnRange(0).max
	min = dt.getColumnRange(0).min		 	 
	$('#year-span-left').html('<b>'+min+'</b>');
	$('#year-span-right').html('<b>'+max+'</b>');		
	var yearSlider = $("#ui-year-slider").slider({
	  min: min,
	  max: max,
	  step: 1,
	  value:[min, max],
	  tooltip: 'always'
	});		  
	yearSlider.on('slideStop', function (newValue) {
	  yearRangeSlider.setState({lowValue: newValue.value[0], highValue: newValue.value[1]});
	  yearRangeSlider.draw();
	})	  
  }
})