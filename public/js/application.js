$( document ).ready(function() {
  var api = require(['./api']);
  debugger
  var $login = $('#login');

  $login.on('submit', function(event) {
    event.preventDefault();
    var email = $login[0]["loginEmail"].value;
    var password = $login[0]["loginPass"].value;

    api.login(email, password);

  });

});