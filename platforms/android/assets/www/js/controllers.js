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


//  var audioElement = document.getElementById("radioAudio");
//  var audioSourceElement = document.getElementById('radioPlayListURL');
  var playingId = -1;

  $scope.checkItems = {};
  $scope.backgroundPlay = {};
  $scope.chats = Chats.all();
  $scope.filteredRadios = Chats.getAllFiltered();
  $scope.favoriteRadios = Chats.getAllFavorite();
  $scope.normalRadios = Chats.getAllNormal();

  $scope.switchIcon = function(chat){
    if (chat.id == playingId){
//    if (chat.id == Chats.playingRadioChannel()){
      return "icon ion-pause";
    }
    else {
      return "icon ion-play";
    }
  };

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

//   $scope.$watch('search', function(oldValue, newValue){
//     //alert('changed');
//     console.log("old "+ oldValue + " new "+newValue);
// //    alert("old "+ oldValue+ " new " + newValue);
//   // todo filter favorite and non favorite list

  document.addEventListener('deviceready', function(){
    var media = null;

    $scope.remove = function(chat) {
      if (playingId == chat.id){
        playingId = -1;
        if (media){
          media.stop();
          media.release();
          media = null;

        }
//        audioElement.pause();
      }
      Chats.remove(chat);
    };



    var timeoutHandle = null;
      $scope.togglePlayRadio = function(chat){
         cordova.plugins.backgroundMode.enable();
         cordova.plugins.backgroundMode.onactivate = function(){
           var backgroundPlayVal = 0;
           angular.forEach($scope.backgroundPlay, function(value, key){
             if (value){
               backgroundPlayVal = 1;
             }
           });
          //  var backgroundPlay = 0;
          //  angular.forEach($scope.backgroundPlay, function(value, key){
          //    if (value){
          //      backgroundPlay = 1;
          //    }
          //  });
          if (backgroundPlayVal == 0){
          //  if (backgroundPlay == 0){
             if (media){
               media.stop();
               media.release();
               media = null;
               playingId = -1;
             }
           }


  // //        myaudio.load();
  // //        myaudio.play();
  //         // audioElement.pause();
  //         // audioElement.load();
  //         // audioElement.play();
  // //        alert("aaa");
  //
  //         if (playingId >= 0){
  // //        if (Chats.playingRadioChannel() >= 0){
  //           // Chats.forcePlayRadioChannel();
  //           audioElement.load();
  //           audioElement.play();
        };

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
        if (playingId == chat.id){
          playingId = -1;
//          audioElement.pause();
          if (media){
            media.stop();
            media.release();
            media = null;

          }
        }
        else {
          playingId = chat.id;
          if (media){
            media.stop();
            media.release();
            media = null;
          }
          media = new Media(chat.url);
          // audioElement.pause();
          // audioSourceElement.src = chat.url;
          // audioElement.load();
          // audioElement.play();
          media.play();

          if (duration > 0){
            timeoutHandle = setTimeout(function(){
              // Chats.stopPlaying();
              playingId = -1;
              if (media){
                media.stop();
                media.release();
                media = null;
              }
              //audioElement.pause();
              timeoutHandle = null;
              $scope.$apply();
            }, duration);
          }
        }
      }
  });
//});
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
