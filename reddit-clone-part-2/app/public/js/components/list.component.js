(function() {
  'use strict'

  angular.module('app')
    .component('list', {
      controller: controller,
      template: `

      <div class="row" ng-repeat="post in $ctrl.posts | filter: $ctrl.searchText.text | orderBy: $ctrl.selectValue.select">
        <div class="col-md-12">
          <div class="well">
            <div class="media-left">
              <img height="200px" width="250px" class="media-object" src="{{post.image_url}}">
            </div>

            <div class="media-body">
              <h4 class="media-heading">
                {{post.title}}
                |
                <a ng-click="$ctrl.upVote(post)"><i class="glyphicon glyphicon-arrow-up"></i></a>
                <a ng-click="$ctrl.downVote(post)"><i class="glyphicon glyphicon-arrow-down"></i></a>
                {{post.vote_count}}

                <div class="pull-left">
                  <p><a class="btn btn-info"
                   ng-click="post.patchEditForm = !post.patchEditForm"> Edit</a></p>
                </div>

              </h4>

              <div class="text-right">
                <h5>{{post.author}}</h5>
              </div>
              <p>
                {{post.body}}
              </p>
              <div>
              <time am-time-ago='post.created_at'></time>

                |
                <i class="glyphicon glyphicon-comment"></i>
                <a ng-click="post.commentForm = !post.commentForm">
                  {{post.comments.length}}comments</a> | <a
                   ng-click="post.hideCommentForm = !post.hideCommentForm"> New Comment</a>
                </a>
              </div>
              <p></p>
              <div name ="hideCommentForm" ng-if="post.hideCommentForm">
              <form name="commentSubmitForm" class="form-inline" ng-submit="$ctrl.addComment(post)">
                <div class="form-group">
                  <input class="form-control" ng-model="post.content">
                </div>
                <div class="form-group">
                  <input type="submit" class="btn btn-primary">
                </div>
              </form>
              </div>

              <div class="row" name="commentForm" ng-if="post.commentForm">
                <div class="col-md-offset-1">
                  <hr>
                  <p ng-repeat="comment in post.comments">
                    {{comment.content}} - <time am-time-ago='comment.created_at'></time> | <a ng-click="$ctrl.deleteComment(post, comment)"> Delete</a> | <a ng-click="$ctrl.editComment(post, comment)">Edit</a>
                  </p>

                  <form name="commentEditForm" ng-submit="$ctrl.updateComment()" ng-show="$ctrl.commentEditForm"  class="form-inline">
                    <div class="form-group">
                      <input ng-model="$ctrl.commentToEdit.content" class="form-control">
                    </div>
                    <div class="form-group">
                      <button class= "btn btn-info" type="submit">Update</button>
                    </div>
                  </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div name = "patchEditForm" ng-if="post.patchEditForm" class="row">
            <div class="col-md-8">
              <form name="editForm" ng-hide="editForm.$submitted" ng-submit="$ctrl.updatePost(post)">
                <div>
                  <label for="title">Title</label>
                  <input ng-model="post.title" id="title" class="form-control"  required>
                </div>
                <div>
                  <label for="body">Body</label>
                  <textarea ng-model="post.body" id="body" class="form-control"></textarea>
                </div>
                <div>
                  <label for="author">Author</label>
                  <input ng-model="post.author" id="author" class="form-control" required>
                </div>
                <div>
                  <label for="image-url">Image URL</label>
                  <input ng-model="post.image_url" id="image-url"  class="form-control">
                </div>
                <div class="form-group">
                <p></p>
                <button type="submit" class="btn btn-primary">
                  Update Post
                </button>
                  <a class="btn btn-primary" ng-click="$ctrl.deletePost(post)">Delete</a>
                </div>
              </form>

            </div>
          </div>

      </div>
      `
    })

  controller.$inject = ['$http', 'postService', 'redditService']

  function controller($http, postService, redditService) {
    const vm = this;
    vm.patchEditForm = true;
    vm.id;
    vm.post;
    vm.comId;
    vm.comment;
    vm.editValue = {};
    vm.posts = postService.posts;


    vm.$onInit = function() {
      postService.fetchPosts()
        .then(function() {
          vm.posts = postService.posts;
          vm.searchText = redditService.filterText;
          vm.selectValue = redditService.filterValue;
        })
      vm.click = false;
      vm.submitted = false;
    }

    vm.updatePost = function(post) {
      $http.patch(`/api/posts/${post.id}`, post)
      .then(function(response) {
        $http.get(`/api/posts`).then(function(response) {
          vm.posts = response.data
          console.log(response.data);
          vm.editForm = !vm.editForm;
        })
      })
    }

    vm.deletePost = function(post) {
      let id = post.id;
      $http.delete(`/api/posts/${id}`).then(function(response) {})
        .then(function() {
          $http.get(`/api/posts`).then(function(response) {
            vm.posts = response.data
          })
        })
    }

    vm.upVote = function(post) {
      let id = post.id
      post.vote_count = post.vote_count + 1
      $http.post(`/api/posts/${id}/votes`, post)
        .then(function(response) {})
    }

    vm.downVote = function(post) {
      let id = post.id
      post.vote_count = post.vote_count - 1
      $http.delete(`/api/posts/${id}/votes`, post)
        .then(function(response) {})
    }

    vm.addComment = function(post) {
      vm.post = post;
      let id = post.id
      post.content = post.content;
      $http.post(`/api/posts/${id}/comments`, post)
        .then(function(response) {
          $http.get(`/api/posts`, post.content)
          .then(function(response) {
            vm.posts = response.data
          })
        })
    }

    vm.editComment = function(post, comment) {
      console.log(comment);
      vm.commentEditForm = !vm.commentEditForm;
      vm.commentToEdit = comment;
      vm.comID = comment.id
      vm.id = post.id
    }

    vm.updateComment = function() {
      $http.patch(`/api/posts/${vm.id}/comments/${vm.comID}`, vm.commentToEdit).then(function(response) {
        $http.get(`/api/posts`).then(function(response) {
          vm.posts = response.data
          console.log(response.data);

        })
      })
    }

    vm.deleteComment = function(post, comment) {
      vm.post = post;
      let id = post.id
      let commentId = comment.id
      $http.delete(`/api/posts/${id}/comments/${commentId}`)
        .then(function(response) {
          $http.get(`/api/posts`).then(function(response) {
            vm.posts = response.data
          })
        })
    }

  }
}());
