function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

//enforce the sandbox
if (readCookie("scope") !== "director" || readCookie("id") === null || readCookie("fprt") === null ){
    window.location.href = document.location.origin + "/directors/login.html";
}
