const request = require('request')

request('http://localhost:8080', error => {
  if (error) {
    throw error
  }
})