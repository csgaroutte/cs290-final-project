"use strict";
var host = "/new";

window.addEventListener("load", function(){
    document.querySelector("#newExerciseForm").addEventListener("submit", function(event){
        event.preventDefault();
        var req = new XMLHttpRequest(); 
        req.open("GET", host + "?a=b", true);
        req.addEventListener("load", function(event){
            if(req.readyState == 4 && req.status >= 200 && req.status < 400){
                console.log("AJAX success!");
            } else {
                console.log("Something isn't right Error: " + req.status + ".");
            }
        });
        req.send(null);
    });
});
