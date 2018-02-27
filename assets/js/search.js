jQuery(function() {
  //Initialize foundation
  $(document).foundation();

  // Initialize lunr with the fields to be searched, plus the boost.
  window.idx = lunr(function () {
    this.field('id');
    this.field('title');
    this.field('content', { boost: 10 });
    this.field('author');
    this.field('categories');
  });

  // Get the generated search_data.json file so lunr.js can search it locally.
  window.data = $.getJSON('/search_data.json');

  // Wait for the data to load and add it to lunr
  window.data.then(function(loaded_data){
    $.each(loaded_data, function(index, value){
      window.idx.add(
        $.extend({ "id": index }, value)
      );
    });
  });

  // Event when the form is submitted
  $("#site_search").submit(function(event){
      event.preventDefault();
      var query = $("#search-query").val(); // Get the value for the text field
      query = query.replace('+', ' ')
      var results = window.idx.search(query); // Get lunr to perform a search
      display_search_results(results); // Hand the results off to be displayed
  });

  function display_search_results(results) {
    var $search_results = $("#search_results");

    // Wait for data to load
    window.data.then(function(loaded_data) {

      // Are there any results?
      if (results.length) {
        $search_results.empty(); // Clear any old results

        // Iterate over the results
        results.forEach(function(result) {
          var item = loaded_data[result.ref];

          // Build a snippet of HTML for this result
          if(item.author) {
            var appendString = '<li><span class="search-topic">' + item.type + '</span><a href="' + item.url + '">' + item.title +'</a><div><span class="search-post-author">' + item.author + '</span><span class="search-post-date">' + item.date + '</span></div></li>';
          } else {
            var appendString = '<li><span class="search-topic">' + item.type + '</span><a href="' + item.url + '">' + item.title +'</a></li>';
          }
          // Add the snippet to the collection of results.
          $search_results.append(appendString);
        });
      } else {
        // If there are no results, let the user know.
        $search_results.html('<li>No results found.<br/>Please check spelling, and spacing.</li>');
      }
    });
  }

  //Event to check for query
  $(document).ready(function(){
    var loc = window.location.href;
    var is_query = loc.indexOf('?q=');
    if (is_query != -1) {
      var query = loc.substr(is_query + 3);
      var decoded_query = decodeURI(query);
      decoded_query = decoded_query.replace('+', ' ')
      $("#search-query").val(decoded_query);

      setTimeout(function(){
        var results = window.idx.search(decoded_query);
        display_search_results(results);
      }, 200);
    }
  });
});
