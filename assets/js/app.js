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

function getInternetExplorerVersion() {
	// Returns the version of Internet Explorer or a -1 (indicating the use of another browser)
  var rv = -1; // Return value assumes failure.
  if (navigator.appName == 'Microsoft Internet Explorer')
  {
    var ua = navigator.userAgent;
    var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
    if (re.exec(ua) != null)
      rv = parseFloat( RegExp.$1 );
  }
  return rv;
}
function checkVersion() {
  var ver = getInternetExplorerVersion();
  
  if ( ver > -1 ) {
    if ( ver < 11.0 ) {		
      alert("Please note, this site was designed to work the best with\nInternet Explorer 11 or a newer EDGE browser.");
		}
  }
}

$(document).ready(function() {
  $(document).foundation();
  dropdownWithTabs();
	checkVersion();
});
