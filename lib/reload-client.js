;(function refresh () {
  var RLD_TIMEOUT = 300;
  var sock = new SockJS(window.location.origin + '/sockreload');
  var reloadDelay = 300;
  var socketDelay = 0;
  var wait = false;
  var sock;
  var checkDelay = 1;
  var checkDelayCounter = 1;

  var newConn = function() {
    //try and connect a new socket to the server.
    sock = new SockJS(window.location.origin + '/sockreload');
    
    //if the server is up then, the sockert will reach this event handler and then call refreshPage
    sock.onopen = function() {
      setTimeout(function() {
        window.location.reload()
      }, socketDelay);
    };
    
    //else the server is down try and connect again with another call to newConn

    //this will exponentially increase the wait time to slow down the calls to checkServerUp to prevent this script from spamming requests if the server doesn’t come back up quickly. 
    //this is useful in the case when the user brings down the server but forgets to close their dev tab or a server has a long restart time.
    checkDelay = (Math.pow(checkDelayCounter,6)) / 10000000000;
    checkDelayCounter++;

    setTimeout(function () {
      newConn();
    }, checkDelay);
  };

  sock.onclose = function() {
    //check for the server only if the user entered in true for a delay
    if (wait) {
      sock = null;

      newConn();
    }
    //else use the default delay or user specified delay
    else {
      setTimeout(function() {
        window.location.reload();
      },reloadDelay);
    }
  };
})();