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
