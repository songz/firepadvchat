var videoResolution = {width: 200, height: 150};

window.TBStart = function(apiKey, parentDiv){
  this.loadJS = function(){
    var fileref=document.createElement('script')
    fileref.setAttribute("type","text/javascript")
    fileref.setAttribute("src", "https://swww.tokbox.com/webrtc/v2.0/js/TB.min.js")
    document.getElementsByTagName("head")[0].appendChild(fileref);
  };
  var self = this;
  this.loadJS();
  this.apiKey = apiKey;
  this.parentDiv = parentDiv;
  this.send = function(){
    var room = encodeURIComponent( document.URL );
    console.log( room );
    var xhr = new XMLHttpRequest();
    var url =  "http://apigenerator.herokuapp.com/getSession?room="+room;
    var method = "GET";
    if ("withCredentials" in xhr) {
      // "withCredentials" only exists on XMLHTTPRequest2 objects.
      xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined") {
      // Otherwise, check if XDomainRequest.
      // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
      xhr = new XDomainRequest();
      xhr.open(method, url);
    }
    xhr.onload = function(){
      var e = JSON.parse(xhr.responseText);
      TB.addEventListener( 'exception', self.exceptionHandler );

      var did = "publisherElement";
      var div = document.createElement('div');
      div.setAttribute('id', did);
      div.style.display="inline-block";
      document.getElementById( self.parentDiv ).appendChild( div );

      self.apiKey = e.apiKey;
      self.session_id = e.session_id;
      self.token = e.token;
      self.publisher = TB.initPublisher( "25740492", did, videoResolution );
      self.session = TB.initSession( self.session_id );

      self.session.addEventListener( 'sessionConnected', self.sessionConnectedHandler );
      self.session.addEventListener( 'streamCreated', self.streamCreatedHandler );
      self.session.connect( self.apiKey, self.token );
    }
    xhr.send();
  };

  this.exceptionHandler = function(e){
    alert(e.message);
  };

  this.sessionConnectedHandler = function(e){
    self.session.publish( self.publisher );
    console.log("session connected");

    self.subscribeToStreams( e.streams );
  };


  this.streamCreatedHandler = function(e){
    self.subscribeToStreams( e.streams );
  };

  this.subscribeToStreams = function(streams){
    for( var i=0; i<streams.length; i++){
      if (streams[i].connection.connectionId == self.session.connection.connectionId) {
        return;
      }

      // Create the div to put the subscriber element in to
      var div = document.createElement('div');
      div.setAttribute('id', 'stream' + streams[i].streamId);
      div.style.display="inline-block";
      document.getElementById( self.parentDiv ).appendChild( div );

      self.session.subscribe( streams[i], div.id, videoResolution );
    }
  };
  
}

TBStart.prototype.startVideo = function(){
  this.send();
}
