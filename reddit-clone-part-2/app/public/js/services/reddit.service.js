(function() {
  'use strict'

  angular.module('app')
    .service('redditService', redditService);

  redditService.$inject = ['$http'];

  function redditService($http) {

    this.filterText = {}
    this.filterText.text;

    this.filterValue = {};

  }

}());
