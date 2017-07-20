function dropdownWithTabs(){
	$('.sync-with-tabs').each(function(){
		var _this = $(this).attr('id');
		var selected_dropdown = $('#'+_this).prev();
		var selected_dropdown_text = $(selected_dropdown).find('.text');
		var targeted_tabs = $('#'+_this).attr('data-sync-target');

		$('#'+_this+ ' li').click(function(){
			var selected_text = $(this).text();
			$(selected_dropdown_text).text(selected_text);

			var selected_index = $(this).index();
			$('#'+targeted_tabs+' li').eq(selected_index).find('a').click();
			$('#'+_this).foundation('close');
		});

		$('#'+targeted_tabs+' li').click(function(){
			var selected_text = $(this).text();
			$(selected_dropdown_text).text(selected_text);
		});


		//sets current tab
		var current_tab = $('#'+targeted_tabs+' li.is-active').text();
		$(selected_dropdown_text).text(current_tab);
	});
}


$(document).ready(function() {
  $(document).foundation();
  dropdownWithTabs();
  //console.log('helloworld)');
});
