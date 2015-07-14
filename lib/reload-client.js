;(function refresh () {
  var RLD_TIMEOUT = 300;
  var sock = new SockJS(window.location.origin + '/sockreload');
  var waitForServer = false;
  var checkDelay = 1;
  var checkDelayCounter = 1;

  sock.onclose = function() {
    //check for the server only if the user entered in true for a delay
    if (waitForServer) {
      checkServerUp(window.location.href, handleResponse)
    }
    //else use the default delay or user specified delay
    else {
      setTimeout(function() {
        window.location.reload();
      },RLD_TIMEOUT);
    }

    function checkServerUp(url, handleResponse) {
      var xhr = new XMLHttpRequest();
      xhr.ontimeout = function () {
        handleResponse(xhr.status);
      };
      xhr.onload = function(e) {
        if (xhr.readyState === 4) {
          //server is up, so we send handleResponse xhrstatus, so it can sort out the correct action based on the status
          handleResponse(xhr.status);
        }
        else{
          handleResponse(xhr.status);
        }
      };
      xhr.onerror = function(e) {
        //server is up, so we send handleResponse xhrstatus, so it can sort out the correct action based on the status
        handleResponse(xhr.status);
      };
      xhr.open('GET', url, true);
      xhr.timeout = 100;
      xhr.send(null);
    }

    function handleResponse(statusCode) {
      if (statusCode === 200) {
        window.location.reload();
      }
      else {
        //this will logarithmically increase the wait time to slow down the calls to checkServerUp to prevent this script from spamming requests if the server doesn’t come back up quickly. 
        //this is useful in the case when the user brings down the server but forgets to close their dev tab or a server has a long restart time.

        // y = x^6 / 10000000000
        checkDelay =  (Math.pow(checkDelayCounter,6)) / 10000000000;
        checkDelayCounter++;

        //if the server is down ask again
        setTimeout(function () {
          checkServerUp(window.location.href, handleResponse);
        }, checkDelay);
      }
    }
  };
})();
