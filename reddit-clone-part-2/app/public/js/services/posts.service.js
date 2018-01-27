(function() {
  'use strict'

  angular.module('app')
    .service('postService', postService);

  postService.$inject = ['$http'];

  function postService($http) {
    var sm = this;
    sm.posts = [];

    sm.fetchPosts = function() {
      return $http.get(`/api/posts`)
        .then(function(response) {
          Object.assign(sm.posts, response.data)
        });
    }

    sm.addPost = function(post) {
      return $http.post(`/api/posts`, post)
        .then(function() {
          return $http.get(`/api/posts`)
            .then(function(response) {
              console.log('Posts fetched', response);
              Object.assign(sm.posts, response.data)
            })
        })
    }

  }
}());
