window.alert = function(){};

var defaultCSS = document.getElementById('bootstrap-css');

function changeCSS(css){
    if(css) $('head > link').filter(':first').replaceWith('<link rel="stylesheet" href="'+ css +'" type="text/css" />');
    else $('head > link').filter(':first').replaceWith(defaultCSS);
}

$( document ).ready(function() {
  var iframe_height = parseInt($('html').height());
  window.parent.postMessage( iframe_height, 'http://www.designsave.com');
});

$(function(){

  // Checking for CSS 3D transformation support
  $.support.css3d = supportsCSS3D();

  var formContainer = $('#formContainer');

  // Listening for clicks on the ribbon links
  $('.flipLink').click(function(e){

    // Flipping the forms
    formContainer.toggleClass('flipped');

    // If there is no CSS3 3D support, simply
    // hide the login form (exposing the recover one)
    if(!$.support.css3d){
      $('#login').toggle();
    }
    e.preventDefault();
  });

  formContainer.find('form').submit(function(e){
    // Preventing form submissions. If you implement
    // a backend, you might want to remove this code
    e.preventDefault();
  });


  // A helper function that checks for the
  // support of the 3D CSS3 transformations.
  function supportsCSS3D() {
    var props = [
      'perspectiveProperty', 'WebkitPerspective', 'MozPerspective'
    ], testDom = document.createElement('a');

    for(var i=0; i<props.length; i++){
      if(props[i] in testDom.style){
        return true;
      }
    }

    return false;
  }
});