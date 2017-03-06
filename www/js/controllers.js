angular.module('starter.controllers', [])

.controller('TabCtrl', function($scope){})

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.checkItems = {};
  $scope.chats = Chats.all();
  $scope.filteredRadios = Chats.getAllFiltered();
  $scope.favoriteRadios = Chats.getAllFavorite();
  $scope.normalRadios = Chats.getAllNormal();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
  $scope.switchIcon = function(chat){
    if (chat.id == Chats.playingRadioChannel()){
      return "icon ion-pause";
    }
    else {
      return "icon ion-play";
    }
  };

  var timeoutHandle = null;
  $scope.togglePlayRadio = function(chat){

    // get how long to play
    var duration = 0;
    angular.forEach($scope.checkItems, function(value, key){
      if (value){
        duration = 5000;
      }
    });

    // clear timeout
    if (timeoutHandle){
      clearTimeout(timeoutHandle);
      timeoutHandle = null;
    }

    // stop after playing for duration
    if(Chats.togglePlayRadioChannel(chat)){
      if (duration > 0){
        timeoutHandle = setTimeout(function(){
          Chats.stopPlaying();
          timeoutHandle = null;
          $scope.$apply();
        }, duration);
      }
    };
  }
  $scope.toggleFavorite = function(chat){
    Chats.toggleFavoriteChannel(chat);
  }
  $scope.clearSearchText = function(){
      var inputDom = document.getElementById('searchField');
      inputDom.innerHTML = '';
      inputDom.value = '';
      inputDom.text = '';
  }

  $scope.addRadioChannel = function(){
    var newURL = prompt('URL');
    if (newURL){
      var newName = prompt('name');
      Chats.addRadioChannel(newURL, newName);
    }
  }

  $scope.searchChanged = function(newVal){
    Chats.filterRadios(newVal);
    var string1 = "hello world";
    var string2 = "wor";
    var string3 = "abc";
    var string4 = '';
    console.log("new "+newVal+string1.includes(string2)+" "+string1.includes(string3)+" "+string1.includes(string4));
  }

  $scope.$watch('search', function(oldValue, newValue){
    //alert('changed');
    console.log("old "+ oldValue + " new "+newValue);
//    alert("old "+ oldValue+ " new " + newValue);
  // todo filter favorite and non favorite list
  })
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
