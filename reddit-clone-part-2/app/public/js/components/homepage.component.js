(function() {
  'use strict'

  angular.module('app')
    .component('homepage', {
      controller: controller,
      template: `
    <nav class="navbar navbar-inverse bg-inverse">
      <div class="container-fluid">
        <div class="navbar-header">
          <a class="navbar-brand" href="#">Redangular</a>
        </div>
        <p></p>
      <div class="pull-right" >
        <p><a class="btn btn-info" ng-click="$ctrl.postNewForm = !$ctrl.postNewForm">New Post</a></p>
      </div>

      <ul class="nav nav-pills">
        <li role="presentation" class="active">
          <input type="text" ng-model="$ctrl.searchText.text" class="form-control input-sm search-form" placeholder="Filter">
        </li>
        <div class="form-inline">
          <label for="sort" style="color:white">Sort by</label>
          <select ng-model="$ctrl.selectValue"
          ng-blur="$ctrl.sortSelect()" class="form-control" id="sort">
            <option value ='title'>Title</option>
            <option value='-vote_count'>Votes</option>
            <option value='-created_at'>Date</option>
          </select>
        </div>
      </ul>
      </div>
      </nav>
      <main class="container">
      <newform ng-if="!$ctrl.postNewForm"></newform>
      <list></list>
      </main>
      `
    })

  controller.$inject = ['$http', 'postService', 'redditService']

  function controller($http, postService, redditService) {
    const vm = this;
    vm.postNewForm = true;

    vm.$onInit = function() {
      vm.posts = postService.posts;
      vm.searchText = redditService.filterText
    }

    vm.sortSelect = function() {
      redditService.filterValue.select = vm.selectValue;
    }
  }
}());
