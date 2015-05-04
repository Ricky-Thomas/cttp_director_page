 /**
 Service clients for C2THEP Director API
 @author Merryman
**/

 define(function(require, exports, module) {

     //promise polyfill
     require("../bower_components/es6-promise/promise.min.js");

     //cookies lib
     var cookies = require("../bower_components/bam.cookies/cookies.js");

     var directorId = cookies.get("id");

     //login
     function login(email, password) {
             return new Promise(function(resolve, reject) {
                 $.ajax({
                     type: "POST",
                     url: "https://api.c2thep.com/api/v1/directors/login",
                     data: {
                         'email': email,
                         'password': password,
                     },
                     dataType: 'json',
                     contentType: 'application/json',
                     xhrFields: {
                         withCredentials: true
                     },
                     crossDomain: true,
                     success: function(data) {
                         resolve(data)
                     },
                     error: function(err) {
                         reject(err.responseJSON);

                     }
                 });
             })
         }
         //logout
     function logout() {
         return getRequest("/api/v1/actors/logout");
     }

     /**edit the currently logged-in director, using any of the params from a director VO
        @see createNewRole
     **/
     function editDirector(params) {
         return new Promise(function(resolve, reject) {
             $.ajax({
                 type: "PATCH",
                 url: "https://api.c2thep.com/api/v1/directors/" + directorId,
                 data: data,
                 contentType: 'application/json',
                 dataType: 'json',
                 xhrFields: {
                     withCredentials: true
                 },
                 crossDomain: true,
                 success: function(data) {
                     resolve(data);
                 },
                 error: function(err) {
                     reject(err.responseJSON);
                 }
             });
         });
     }

     //Get the currently logged-in diector's profile
     function getProfile() {
         return getRequest("/api/v1/directors/" + directorId);
     }


     /**
     createNewRole
     Example:
     createNewRole({
        'closing_date': '2015-06-21 00:00:00', //mysql-style date, should be the day after submit_by
         'pay_rate': "$700 buyout",
         'shoot_date': "06/30/2015",
         'gender': "Male",
         'submit_by': "06/20/2015",
         'callback_start': "06/24/2015",
         'callback_end': "06/26/2015",
         'short_desc': "Short Description",
         'long_desc': "A longer description of the role.",
         'notes': "Notes for the actor",
         'title': "This is a test",
         'lines': "These are test lines for the lines field.",
         'director_id': 123,
         'director_name': "Test Director",
         'status' : "STAGING"
     })
         **/
     function createNewRole(params) {

         //autofill some params
         params.director_id = directorId;
         if (typeof params.submit_by !== 'undefined')
             params.closing_date = getClosingDate(params.submit_by);

         return new Promise(function(resolve, reject) {
             var role = params;
             $.ajax({
                 type: "POST",
                 url: "https://api.c2thep.com/api/v1/roles",
                 data: params,
                 dataType: 'json',
                 contentType: 'application/json',
                 xhrFields: {
                     withCredentials: true
                 },
                 crossDomain: true,
                 success: function(data) {
                     resolve(data);
                 },
                 error: function(err) {
                     reject(err.responseJSON);
                 }
             });
         });
     }

     function getDirectorRoles() {
         return getRequest("/api/v1/directors/" + directorId + "/roles");
     }


     function getRoleDetail(roleId) {
         return getRequest("/api/v1/roles/" + roleId);
     }

     function getRoleAuditions(roleId) {
         return getRequest("/api/v1/roles/" + roleId + "/auditions");
     }

     function acceptAudition(auditionId) {
         return getRequest("/api/v1/auditions/" + auditionId + "/accept");
     }

     function rejectAudition(auditionId) {
         return getRequest("/api/v1/auditions/" + auditionId + "/reject");
     }

     function closeOutRole(roleId) {
         return getRequest("/api/v1/roles/" + roleId + "/close");
     }



     //HELPER FUNCTIONS

     //Generic GET helper
     function getRequest(url) {
         return new Promise(function(resolve, reject) {
             $.ajax({
                 url: "https://api.c2thep.com" + url,
                 contentType: 'application/json',
                 xhrFields: {
                     withCredentials: true
                 },
                 crossDomain: true,
                 success: function(data) {
                     resolve(data);
                 },
                 error: function(err) {
                     reject(err.responseJSON);
                 }
             });
         });
     }



     function getClosingDate(submitByDateStr) {
         var submitByArr = submitByDateStr.split("/"),
             month = parseInt(submitByArr[0]) - 1,
             day = parseInt(submitByArr[1]),
             year = parseInt(submitByArr[2]),
             submitByDate = new Date(year, month, day),
             closing_date = new Date(submitByDate);

         closing_date.setDate(submitByDate.getDate() + 1);
         closing_date = closing_date.toMysqlFormat();
         return closing_date;
     }


     function twoDigits(d) {
         if (0 <= d && d < 10) return "0" + d.toString();
         if (-10 < d && d < 0) return "-0" + (-1 * d).toString();
         return d.toString();
     }

     Date.prototype.toMysqlFormat = function() {
         return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " 00:00:00";
     };



     //PUBLIC INTERFACE

     exports = {
         login: login,
         logout: logout,
         getProfile: getProfile,
         editDirector: editDirector,
         createNewRole: createNewRole,
         getDirectorRoles: getDirectorRoles,
         getRoleDetail: getRoleDetail,
         getRoleAuditions: getRoleAuditions,
         acceptAudition: acceptAudition,
         rejectAudition: rejectAudition,
         closeOutRole: closeOutRole
     };

     window.directorAPI = exports;
     module.exports = exports;
 });
