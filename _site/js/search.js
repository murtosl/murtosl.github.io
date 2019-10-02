var app = new Vue({
  el: '#app',
  data: {
    results: [],
    search_data: [],
    search_index: {},
    search_query: ""
  },
  methods: {
    search: function() {
      searchResults = this.search_index.search(this.search_query)
      results = []
      searchResults.forEach(function(element){
        app.search_data.forEach(function(el){
          if (el.id == element.ref) {
            console.log(el.category)
            decoded = el.category.replace(/&quot;/g, '"')
            console.log(decoded)
            category = JSON.parse(decoded)
            el.category = category[0]
            results.push(el)
          }
        })
      })
      this.results = results
    }
  },
  mounted: function() {
    axios
      .get('/search_data.json')
      .then(response => {
        this.search_data = response.data
        this.search_index = lunr(function() {
          this.field('id')
          this.field('title', { boost: 5 })
          this.field('author')
          this.field('category')
          this.field('desc', { boost: 15 })
          this.field('tags', { boost: 10 })

          idx = this

          app.search_data.forEach(function(element){
            idx.add(element)
          })
        })
      })
  }
})

/*
jQuery(function () {
  // Download the data from the JSON file we generated
  window.data = $.getJSON('/search_data.json');

  // Wait for the data to load and add it to lunr
  window.data.then(function (loaded_data) {
    // Initalize lunr with the fields it will be searching on. I've given title
    // a boost of 10 to indicate matches on this field are more important.
    window.idx = lunr(function () {
      this.field('id');
      this.field('title', { boost: 5 });
      this.field('author');
      this.field('category');
      this.field('desc', { boost: 15 });
      this.field('tags', { boost: 10 });

      docKeys = Object.keys(loaded_data)

      for (var k, v in docKeys) {
        this.add({ "id": v }, loaded_data[v])
        console.log("Adding " + v)
      }
    });
  });

  // Event when the form is submitted
  $("#site_search").submit(function () {
    event.preventDefault();
    var query = $("#search_box").val(); // Get the value for the text field
    var results = window.idx.search(query); // Get lunr to perform a search
    display_search_results(results); // Hand the results off to be displayed
  });

  function display_search_results(results) {
    var $search_results = $("#search_results");

    // Wait for data to load
    window.data.then(function (loaded_data) {

      // Are there any results?
      if (results.length) {
        $search_results.empty(); // Clear any old results

        // Iterate over the results
        results.forEach(function (result) {
          var item = loaded_data[result.ref];

          // Build a snippet of HTML for this result
          var appendString = "<p>";
          if (item.category.indexOf("worthfull") != -1) {
            appendString += "<span style=\"color: green;\">&#10049;</span>";
          } else if (item.category.indexOf("controversatory") != -1) {
            appendString += "<span style=\"color: navy;\">&#10019;</span>";
          } else {
            appendString += "<span style=\"color: #17C5E8;\">&#10002;</span>";
          }
          appendString += '<a href=\"' + item.url + '\">' + item.title + '</a> - ' + item.date + '<br/>' + item.desc + '<br/><span class=\"cite\">Tags: ' + item.tags + '</p>';

          // Add it to the results
          $search_results.append(appendString);
        });
      } else {
        $search_results.html('<li>No results found</li>');
      }
    });
  }
});
*/