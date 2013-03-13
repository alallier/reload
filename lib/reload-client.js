;(function refresh () {
  var RLD_TIMEOUT = 300;
  var sock = new SockJS(window.location.href + 'sockreload');

  sock.onclose = function() {
    setTimeout(function() {
      window.location.reload();
    },RLD_TIMEOUT);
  };
})();