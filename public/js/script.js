"use strict";
var host = "/new";

function validateNewEntry(form){
    var reps = form.reps.value;
    var weight = form.weight.value;
    var units = form.lbs.value;
    
    //validate here
}


window.addEventListener("load", function(){
    
    var resetReq = new XMLHttpRequest();
    resetReq.open("GET", "/reset-table", true);
    resetReq.addEventListener("load", function(){
        if(resetReq.readyState == 4 && resetReq.status >=200 && resetReq.status < 400){
            console.log(resetReq.responseText);
        } else {
            console.log("Something isn't right Error: " + req.status + ".");
        }
    });
    resetReq.send(null);

    document.querySelector("#newExerciseForm").addEventListener("submit", function(event){
        event.preventDefault();

        var form = document.querySelector("#newExerciseForm");
        validateNewEntry(form); 
        
        var payload = {};
        payload.params = [];
        payload.params.push(null);
        payload.params.push(form.elements['exercise'].value); 
        payload.params.push(form.elements['reps'].value); 
        payload.params.push(form.elements['weight'].value); 
        payload.params.push(form.elements['lbs'].value); 
        payload.params.push(form.elements['date'].value); 
      
        //for(var i = 0; i < form.elements.length - 1; i++){
        //    params[form.elements[i].name] = form.elements[i].value;
        //};

        console.log(payload);

        var req = new XMLHttpRequest(); 
        req.open("POST", host, true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.addEventListener("load", function(event){
            if(req.readyState == 4 && req.status >= 200 && req.status < 400){
                //console.log(req.responseText);
            } else {
                console.log("Something isn't right Error: " + req.status + ".");
            }
        });
        req.send(JSON.stringify(payload));
    });
});
