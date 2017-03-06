angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array
  var generatedId = 100;
  var playingId = -1;

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'RTHK1',
    lastText: 'You on your way?',
    face: 'img/rthk1.png',
    url: 'http://rthkaudio1-lh.akamaihd.net/i/radio1_1@355864/master.m3u8',
    favorite: false
  }, {
    id: 1,
    name: 'RTHK2',
    lastText: 'Hey, it\'s me',
    face: 'img/rthk2.png',
    url:'http://rthkaudio2-lh.akamaihd.net/i/radio2_1@355865/master.m3u8',
    favorite: false
  }, {
    id: 2,
    name: 'RTHK3',
    lastText: 'I should buy a boat',
    face: 'img/rthk3.png',
    url:'http://rthkaudio3-lh.akamaihd.net/i/radio3_1@355866/master.m3u8',
    favorite: false
  }, {
    id: 3,
    name: 'RTHK4',
    lastText: 'Look at my mukluks!',
    face: 'img/rthk4.png',
    url:'http://rthkaudio4-lh.akamaihd.net/i/radio4_1@355867/master.m3u8',
    favorite: false
  }, {
    id: 4,
    name: 'RTHK5',
    lastText: 'This is wicked good ice cream.',
    face: 'img/rthk5.png',
    url:'http://rthkaudio5-lh.akamaihd.net/i/radio5_1@355868/master.m3u8',
    favorite: false
  }, {
    id: 5,
    name: 'RTHK putonghua',
    lastText:'rthk ppp',
    face:'img/rthk_putonghua.png',
    url:'http://rthkaudio6-lh.akamaihd.net/i/radiopth_1@355869/master.m3u8',
    favorite: false
  }, {
    id: 6,
    name: 'DAB31',
    lastText:'dab 311111',
    face:'img/dab31.png',
    url:'http://rthkaudio7-lh.akamaihd.net/i/dab31_1@355870/master.m3u8',
    favorite: false
  }, {
    id: 7,
    name: 'DAB33',
    lastText: 'dab 333333',
    face:'img/dab33.png',
    url:'http://rthkaudio8-lh.akamaihd.net/i/dab33_1@355871/master.m3u8',
    favorite: false
  },{
      id: 8,
      name: 'DAB35',
      lastText: 'dab 3555555',
      face:'img/dab35.png',
      url:'http://rthkaudio9-lh.akamaihd.net/i/dab35_1@355872/master.m3u8',
      favorite: false
  }];

  // get audio and source dom
  var audioElement = document.getElementById("radioAudio");
  var audioSourceElement = document.getElementById('radioPlayListURL');

  // merge default and user defined radios
  var allRadios = [];
  for (var rid = 0; rid < chats.length; rid++){
    allRadios.push(chats[rid]);
  }
  var userRadioListString = window.localStorage['userList'];
  var userList = [];
  if (userRadioListString){
    userList = angular.fromJson(userRadioListString);
    for (var ulid = 0; ulid < userList.length; ulid++){
      allRadios.push(userList[ulid]);
    }
  }

  // read radios marked favorite
  var favoriteListString = window.localStorage['favoriteList'];
  var favoriteList = [];
  if (favoriteListString){
    favoriteList = angular.fromJson(favoriteListString);
    for (var rid = 0; rid < allRadios.length; rid++){
      if (favoriteList.indexOf(allRadios[rid].id) >= 0){
          allRadios[rid].favorite = true;
      }
    }
  }

  // find favorite and non favorite radios
  var normalRadios = [];
  var favoriteRadios = [];
  for (var rid = 0; rid < allRadios.length; rid++){
    if (allRadios[rid].id > generatedId){
      generatedId = allRadios[rid].id;
    }
    if (allRadios[rid].favorite){
      favoriteRadios.push(allRadios[rid]);
    }
    else {
      normalRadios.push(allRadios[rid]);
    }
  }

  // add filtered radios
  var filterWord = '';
  var allFilteredRadios = [];
  for (var rid = 0; rid < favoriteRadios.length; rid++){
    allFilteredRadios.push(favoriteRadios[rid]);
  }
  for (var rid = 0; rid < normalRadios.length; rid++){
    allFilteredRadios.push(normalRadios[rid]);
  }


  var timeoutHandle = null;

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      if (playingId == chat.id){
        playingId = -1;
        audioElement.pause();
      }
      for (var i = 0; i < normalRadios.length; i++){
        if (normalRadios[i].id == chat.id){
          normalRadios.splice(i, 1);
          break;
        }
      }
      for (var i = 0; i < favoriteRadios.length; i++){
        if (favoriteRadios[i].id == chat.id){
          favoriteRadios.splice(i,1);
          break;
        }
      }
      for (var i = 0; i < userList.length; i++){
        if (userList[i].id == chat.id){
          userList.splice(i,1);
          window.localStorage['userList'] = angular.toJson(userList);
          break;
        }
      }
      for (var i = 0; i < favoriteList.length; i++){
        if (favoriteList[i]==chat.id){
          favoriteList.splice(i, 1);
          window.localStorage['favoriteList'] = angular.toJson(favoriteList);
          break;
        }
      }
      allFilteredRadios.length = 0;
      for (var i = 0; i < favoriteRadios.length; i++){
        if (favoriteRadios[i].name.includes(filterWord)){
          allFilteredRadios.push(favoriteRadios[i]);
        }
      }
      for (var i = 0; i < normalRadios.length; i++){
        if (normalRadios[i].name.includes(filterWord)){
          allFilteredRadios.push(normalRadios[i]);
        }
      }
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    },
    getAllFiltered : function(){
      return allFilteredRadios;
    },
    getDisplayName : function(chat){
      if (chat.favorite){
        return "*"+chat.name;
      }
      else {
        return chat.name;
      }
    },
    getAllNormal: function(){
      return normalRadios;
    },
    getAllFavorite: function(){
      return favoriteRadios;
    },
    filterRadios : function(word){
      filterWord = word;
      allFilteredRadios.length = 0;
      for (var i = 0; i < favoriteRadios.length; i++){
        if (favoriteRadios[i].name.includes(filterWord)){
          allFilteredRadios.push(favoriteRadios[i]);
        }
      }
      for (var i = 0; i < normalRadios.length; i++){
        if (normalRadios[i].name.includes(filterWord)){
          allFilteredRadios.push(normalRadios[i]);
        }
      }
    },
    stopPlaying: function(){
      playingId = -1;
      audioElement.pause();
    },
    togglePlayRadioChannel: function(chat){

      if (playingId == chat.id){
        playingId = -1;
        audioElement.pause();
        return false;
      }
      else {
        playingId = chat.id;
        audioElement.pause();
        audioSourceElement.src = chat.url;
        audioElement.load();
        audioElement.play();
        return true;
      }
    },
    playingRadioChannel: function(){
      return playingId;
    },
    toggleFavoriteChannel: function(chat){
      if (chat.favorite){
        chat.favorite = false;
        normalRadios.push(chat);
        for (var i = 0; i < favoriteRadios.length; i++){
          if (favoriteRadios[i].id == chat.id){
            favoriteRadios.splice(i, 1);
            break;
          }
        }
        for (var i = 0; i < favoriteList.length; i++){
          if (favoriteList[i] == chat.id){
            favoriteList.splice(i, 1);
            break;
          }
        }
      }
      else {
        chat.favorite = true;
        for (var i = 0; i < normalRadios.length; i++){
          if (normalRadios[i].id == chat.id){
            normalRadios.splice(i, 1);
            break;
          }
        }
        favoriteRadios.unshift(chat);
        favoriteList.push(chat.id);
      }
      window.localStorage['favoriteList'] = angular.toJson(favoriteList);
      allFilteredRadios.length = 0;
      for (var i = 0; i < favoriteRadios.length; i++){
        if (favoriteRadios[i].name.includes(filterWord)){
          allFilteredRadios.push(favoriteRadios[i]);
        }
      }
      for (var i = 0; i < normalRadios.length; i++){
        if (normalRadios[i].name.includes(filterWord)){
          allFilteredRadios.push(normalRadios[i]);
        }
      }
    },
    addRadioChannel: function(newURL, newName){
      generatedId++;
      var newChannel = {
        id: generatedId,
        name: newName,
        lastText: 'dab 3555555',
        face:'img/default_radio.png',
        url: newURL,
        favorite: false
      };
      allRadios.push(newChannel);
      normalRadios.push(newChannel);
      userList.push(newChannel);
      window.localStorage['userList'] = angular.toJson(userList);
      allFilteredRadios.length = 0;
      for (var i = 0; i < favoriteRadios.length; i++){
        if (favoriteRadios[i].name.includes(filterWord)){
          allFilteredRadios.push(favoriteRadios[i]);
        }
      }
      for (var i = 0; i < normalRadios.length; i++){
        if (normalRadios[i].name.includes(filterWord)){
          allFilteredRadios.push(normalRadios[i]);
        }
      }
    } 
  };
});
