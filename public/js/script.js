"use strict";
var host = "/new";

function validateNewEntry(form){
    //Validate name of exercise.
    var exercise = form.exercise.value;
    if(exercise == ""){
        form.exercise.value = "Field cannot be blank!";
        return false;
    }

    //Check that date has not passed and is valid.
    var date = form.date.value;
    console.log(typeof date);
    var d = date.toString();
    var currentD = new Date();
    if(/^\d{4}-\d{1,2}-\d{1,2}$/.test(d)){
        var year = d.slice(0,4);
        var month, day;
        if(d.charAt(6) == '-'){
            month = d.slice(5,6);
            day = d.slice(7);
        } else {
            month = d.slice(5,7);
            day = d.slice(8);
        }
        if((year > currentD.getFullYear()) ||
            (year >= currentD.getFullYear() && (month > currentD.getMonth() + 1)) ||
            (year >= currentD.getFullYear() && month >= currentD.getMonth() + 1 &&
            day > currentD.getDate())){ 
                form.date.value = "Can't enter future dates!";
                return false;
            } 
    }
    else {
        form.date.value = "Date must be in format YYYY-MM-DD.";
        return false;
    }

    //Check that units is boolean (1 or 0).
    var units = form.units.value;
    if(units != 1 && units != 0){
      form.units.value = "Enter 1 or 0!";
      return false; 
    }
    return true;
}



function appendToExerciseRecords(vals){
    var form = document.createElement("form");
    form.innerHTML = "<input type='hidden' name='id' value=" + vals.id + ">" +  
        "Exercise: <input readonly type='text' name='exercise' value='" + vals.exercise + "'> " +
        "Reps: <input readonly type='text' name='reps' value='" + vals.reps + "'> " +
        "Weight: <input readonly type='text' name='weight' value='" + vals.weight + "'> " +
        "Units: <input readonly type='text' name='units'  value='" + 
        (vals.units == '1' ? 'lbs' : 'kg') + "'> " +
        "Date: <input readonly type='date' name='date' value='" + vals.date + "'> " +
        "<button name='edit' type='button'>Edit</button> " + 
        "<button name='delete' type='button'>Delete</button> ";
    document.getElementById("exerciseRecords").appendChild(form);
    form.elements['delete'].addEventListener('click', function(event){
        handleDeleteExercise(event, this);
    });
    var handler;
    form.elements['edit'].addEventListener('click', handler = function(event){
        handleEditExercise(event, this);
    });
}

function handleEditExercise(event, button){

    var form = button.parentElement;
    if(button.name == 'edit'){
        button.innerHTML = 'Done Editing';
        button.name = 'done';
    
        for(var i = 1; i < 6; i++){
            form.elements[i].removeAttribute('readonly'); 
        }
    } 
   
    else if(button.name == 'done'){
        if(validateNewEntry(form)){ 
            var payload = {};
            payload.id = (form.elements['id'].value);
            payload.exercise = (form.elements['exercise'].value); 
            payload.reps = (form.elements['reps'].value); 
            payload.weight = (form.elements['weight'].value); 
            payload.date = (form.elements['date'].value); 
            payload.units = (form.elements['units'].value); 

            console.log(payload);

            var req = new XMLHttpRequest(); 
            req.open("POST", '/edit', true);
            req.setRequestHeader('Content-Type', 'application/json');
            req.addEventListener("load", function(event){
                if(req.readyState == 4 && req.status >= 200 && req.status < 400){
                    console.log(req.responseText);
                } else {
                    console.log("Something went wrong. Error: " + req.status + ".");
                }
            });
            req.send(JSON.stringify(payload)); 
            
            for(var i = 1; i < 6; i++){
                form.elements[i].setAttribute('readonly', 'readonly'); 
            } 
            button.name = 'edit';
            button.innerHTML = 'Edit';       
        }
    }
}

function resetCreateFormValues(){
}

function resetTable(){
    var resetReq = new XMLHttpRequest();
    resetReq.open("GET", "/reset-table", true);
    resetReq.addEventListener("load", function(){
        if(resetReq.readyState == 4 && resetReq.status >=200 && resetReq.status < 400){
            //console.log(resetReq.responseText);
        } else {
            console.log("Something isn't right. Error: " + req.status + ".");
        }
    });
    resetReq.send(null);
}

function handleDeleteExercise(event, button){
    var form = button.parentElement;
    var q = '?id=' + form.elements['id'].value;
    var req = new XMLHttpRequest();
    req.open('GET', '/delete' + q, true);
    req.addEventListener('load', function(){
        if(req.readyState == 4 && req.status >= 200 && req.status < 400){
            form.remove();
        } else {
            console.log("Something isn't right. Error: " + req.status + ".");
        }
    });
    req.send(null);
}
                                                  
function handleNewExerciseEvent(){
    document.querySelector("#newExerciseForm").addEventListener("submit", function(event){
        event.preventDefault();

        var form = document.querySelector("#newExerciseForm");
        if(validateNewEntry(form)){
            var payload = {};
            payload.params = [];
            payload.params.push(null);
            payload.params.push(form.elements['exercise'].value); 
            payload.params.push(form.elements['reps'].value); 
            payload.params.push(form.elements['weight'].value); 
            payload.params.push(form.elements['date'].value); 
            payload.params.push(form.elements['units'].value); 
          
            console.log(payload.params);

            var req = new XMLHttpRequest(); 
            req.open("POST", host, true);
            req.setRequestHeader('Content-Type', 'application/json');
            req.addEventListener("load", function(event){
                if(req.readyState == 4 && req.status >= 200 && req.status < 400){
                    console.log((JSON.parse(req.responseText)));
                    appendToExerciseRecords(JSON.parse(req.responseText));
                } else {
                    console.log("Something isn't right Error: " + req.status + ".");
                }
            });
            req.send(JSON.stringify(payload));
       }
    });

}


resetTable();

window.addEventListener("load", function(){
    handleNewExerciseEvent();
   });
