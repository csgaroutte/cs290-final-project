"use strict";
var host = "/new";

function validateNewEntry(form){
    var reps = form.reps.value;
    var weight = form.weight.value;
    var units = form.lbs.value;
    
    //validate here
}

window.addEventListener("load", function(){
    document.querySelector("#newExerciseForm").addEventListener("submit", function(event){
        event.preventDefault();

        var form = document.querySelector("#newExerciseForm");
        validateNewEntry(form); 
        
        var params = {};
        for(var i = 0; i < form.elements.length - 1; i++){
            params[form.elements[i].name] = form.elements[i].value;
        };

        console.log(params);

        var req = new XMLHttpRequest(); 
        req.open("POST", host, true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.addEventListener("load", function(event){
            if(req.readyState == 4 && req.status >= 200 && req.status < 400){
                console.log(req.responseText);
            } else {
                console.log("Something isn't right Error: " + req.status + ".");
            }
        });
        req.send(JSON.stringify(params));
    });
});
