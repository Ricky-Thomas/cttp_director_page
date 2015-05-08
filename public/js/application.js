define(function(require, exports, module) {
  var api = require('./api');
  var $login = $('#login');

  $login.on('submit', function(event) {
    event.preventDefault();
    var email = $login[0]["loginEmail"].value;
    var password = $login[0]["loginPass"].value;

    api.login(email, password);

  });

  //promise chain
  //get roles for this director
  api.getDirectorRoles().then(function(data){
      console.log("My Roles")
      console.dir(data)
  }).then(function(){
      //get details for a single role
      return api.getRoleDetail(563)
  }).then(function(data){
      console.log("Role Detail:")
      console.dir(data);
  }).then(function(){
      //get auditions for a role
      return api.getRoleAuditions(563)
  }).then(function(data){
      console.log("Role Auditions:")
      console.dir(data);
  });


});
