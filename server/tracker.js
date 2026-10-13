(function(){
  var scriptTag = document.currentScript;
  var apiBase = new URL(scriptTag.src).origin;

  var sessionId = localStorage.getItem("sessionId");
  if(!sessionId){
    sessionId = crypto.randomUUID();
    localStorage.setItem("sessionId", sessionId);
  }

  function sendEvent(data) {
    var event ={
      sessionId: sessionId,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight,
    };
    for(var key in data){
      event[key] = data[key];
    }

    fetch(apiBase + "/api/events", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(event),
      keepalive: true,
    });
  }
  sendEvent({eventType: "page_view"});

  document.addEventListener("click", function(e){
    sendEvent({
      eventType: "click",
      x: e.pageX,
      y: e.pageY,
    });
  });
})();