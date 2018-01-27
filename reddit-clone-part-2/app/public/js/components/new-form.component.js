(function() {
  'use strict'

  angular.module('app')
    .component('newform', {
      controller: controller,
      template: `
      <div class="row">
        <div class="col-md-8">

          <form name="postForm" ng-hide="postForm.$submitted" ng-submit="$ctrl.addPost()">
            <div>
              <label for="title">Title</label>
              <input id="title" class="form-control" ng-model="$ctrl.post.title" required>
            </div>
            <div>
              <label for="body">Body</label>
              <textarea id="body" class="form-control" ng-model="$ctrl.post.body"></textarea>
            </div>
            <div>
              <label for="author">Author</label>
              <input id="author" class="form-control" ng-model="$ctrl.post.author" required>
            </div>
            <div>
              <label for="image-url">Image URL</label>
              <input id="image-url" class="form-control" ng-model="$ctrl.post.image_url">
            </div>
            <div class="form-group">
            <p></p>
              <button type="submit" class="btn btn-primary">
                Create Post
              </button>
            </div>
          </form>

        </div>
      </div>
      `
    })

  controller.$inject = ['$http', '$state', 'postService']

  function controller($http, $state, postService) {
    const vm = this;

    vm.reloadPage = function() {
      $window.location.reload();
    }

    vm.$onInit = function() {
      vm.submitted = false;
    }

    vm.addPost = function() {
      postService.addPost(vm.post)
        .then(function() {
          console.log(vm.post);
          delete vm.post;
          $state.go('home')
        })
    }


  }
}());
