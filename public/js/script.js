"use strict";

/* function: validateDate
 * params: form element
 * returns: false if any validation fails, true if all validations pass
 * description: checks that form entries are valid for an exercise submission
 */
function validateDate(date){
    //Check that date has not passed and is valid.
    var d = date.value.toString();
    var currentD = new Date();
    if(/^\d{4}-\d{1,2}-\d{1,2}$/.test(d)){
        var year = d.slice(0,4);
        /* Check if date is a leap year. Psuedocode for the algorith below was
        obtained from https://en.wikipedia.org/wiki/Leap_year. */
        var leapYear;
        if(year % 4){
            leapYear = false;
        } else if(year % 100){
            leapYear = true;
        } else if(year % 400){
            leapYear = false;
        } else {
            leapYear = true;
        }


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
            alert('Date cannot be in the future.');
            return false;
        } else if( month == 0 || day == 0){
            alert('Neither month nor day can be 0.');
            return false;
        } else if(month > 12) {
            return false;
        } else if((month == '1' || month == '3' || month == '5' 
                || month == '7' || month == '8' || month == '10'
                || month == '12') && day > 31){
            alert('Day not in range.');
            return false;
        } else if((month == '4' || month == '6' || month == '9'
                    || month == '11') && day > 30){
            alert('Day not in range.');
            return false;
        } else if(leapYear && month == '2' && day > 29){
            alert('Day not in range.');
            return false;
        } else if(!leapYear && month == '2' && day > 28){
            alert('Day not in range.');
            return false;
        }
    }
    else {
        alert('Date must be in format YYYY-MM-DD.');
        return false;
    }
    return true;
}

/* function: printTable
 * params: none
 * returns: none
 * description: appends all records to the exercise records html table
 */
function printTable(){
    var req = new XMLHttpRequest();
    req.open('GET', '/get-list', true);
    req.addEventListener('load', function(){
        if(req.readyState == 4 && req.status >= 200 && req.status < 400){
            var res = JSON.parse(req.responseText);
            if(!res.length){
                document.querySelector("#recordsBanner").textContent =
                    'Your list is empty!';
                document.querySelector('#tableHeaders').innerHTML = '';
            } else {
                //Change table banner.
                document.querySelector("#recordsBanner").textContent = '';

                //Attach table headers.
                var tr = document.querySelector("#tableHeaders");
                tr.innerHTML = '';
                var th = document.createElement("th");
                var text = document.createTextNode("Exercise");
                th.appendChild(text);
                tr.appendChild(th);
                th = document.createElement("th");
                text = document.createTextNode("Reps");
                th.appendChild(text);
                tr.appendChild(th);
                th = document.createElement("th");
                text = document.createTextNode("Weight");
                th.appendChild(text);
                tr.appendChild(th);
                th = document.createElement("th");
                text = document.createTextNode("Units");
                th.appendChild(text);
                tr.appendChild(th);
                th = document.createElement("th");
                text = document.createTextNode("Date");
                th.appendChild(text);
                tr.appendChild(th);

                //Append records to table.
                var tbody = document.querySelector('#exerciseRecords');
                tbody.innerHTML = '';
                for(var i = 0; i < res.length; i++){
                    appendToExerciseRecords(res[i]);
                }
            }
        } else {
            console.log('Something went wrong. Error: ' + req.status);
        }
    });
    req.send(null);
}

/* function: appendToExerciseRecords
 * params: vals - object describing a single exercise record
 * returns: none
 * description: appends a single exercise record to the exercise records html table;
 * used by printTable() to append all records to the html table
 */
function appendToExerciseRecords(vals){
    //Ugly DOM manipulations to create a record that is also a
    //readonly form until the edit button is clicked.
    var row = document.createElement('tr');
    var td = document.createElement('td');
    var input = document.createElement('input');
    input.setAttribute('required', 'required');
    input.setAttribute('oninvalid',
            "this.setCustomValidity('Exercise name" +
                " must not be empty and must be composed only of uppercase and"+
                " lowercase letters.')");
    input.setAttribute('pattern', '^(?!\\s*$)[A-Za-z\\s]{1,255}$');
    input.setAttribute('readonly', 'readonly');
    input.setAttribute('type', 'text');
    input.setAttribute('name', 'exercise');
    input.setAttribute('value', vals.exercise);
    input.setAttribute('oninput', 'this.setCustomValidity("")');
    td.appendChild(input);
    row.appendChild(td);    
    td = document.createElement('td');
    input = document.createElement('input');
    input.setAttribute('required', 'required');
    input.setAttribute('readonly', 'readonly');
    input.setAttribute('type', 'number');
    input.setAttribute('min', '0');
    input.setAttribute('max', '50000');
    input.setAttribute('name', 'reps');
    input.setAttribute('value', vals.reps);
    input.setAttribute('oninput', 'this.setCustomValidity("")');
    td.appendChild(input);
    row.appendChild(td); 
    td = document.createElement('td');
    input = document.createElement('input');
    input.setAttribute('required', 'required');
    input.setAttribute('readonly', 'readonly');
    input.setAttribute('min', '0');
    input.setAttribute('max', '50000');
    input.setAttribute('type', 'number');
    input.setAttribute('name', 'weight');
    input.setAttribute('value', vals.weight);
    input.setAttribute('oninput', 'this.setCustomValidity("")');
    td.appendChild(input);
    row.appendChild(td); 
    td = document.createElement('td');
    input = document.createElement('input');
    input.setAttribute('required', 'required');
    input.setAttribute('oninvalid', 'this.setCustomValidity("Enter 1 for lbs  or 0 for kg.")');
    input.setAttribute('pattern', '^[0-1]$');
    input.setAttribute('readonly', 'readonly');
    input.setAttribute('type', 'text');
    input.setAttribute('name', 'units');
    input.setAttribute('value', (vals.units == "1" ?"lbs":"kg"));
    input.setAttribute('oninput', 'this.setCustomValidity("")');
    td.appendChild(input);
    row.appendChild(td); 
    td = document.createElement('td');
    input = document.createElement('input');
    input.setAttribute('readonly', 'readonly');
    input.setAttribute('type', 'text');
    input.setAttribute('name', 'date');
    input.setAttribute('oninput', 'this.setCustomValidity("")');
    input.setAttribute('value', vals.dateF);
    td.appendChild(input);
    row.appendChild(td); 
    td = document.createElement('td');
    var button= document.createElement('button');
    button.setAttribute('type', 'button');
    button.setAttribute('name', 'edit');
    button.appendChild(document.createTextNode("Edit"));
    td.appendChild(button);
    row.appendChild(td); 
    td = document.createElement('td');
    button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.setAttribute('name', 'delete');
    button.appendChild(document.createTextNode('Delete'));
    td.appendChild(button);
    row.appendChild(td); 
    td = document.createElement('td');
    input = document.createElement('input');
    input.setAttribute('readonly', 'readonly');
    input.setAttribute('type', 'hidden');
    input.setAttribute('name', 'id');
    input.setAttribute('value', vals.id);
    td.appendChild(input);
    row.appendChild(td); 

    document.getElementById("exerciseRecords").appendChild(row);

    row.children[6].firstChild.addEventListener('click', function(event){
        handleDeleteExercise(event, this);
    });

    row.children[5].firstChild.addEventListener('click', function(){
        if(this.name == "edit" && !document.querySelector("#submittedButton")){
            this.setAttribute("id", "submittedButton");
            this.setAttribute("type", "submit");
        } else if(this.name == "edit" && this.id != "submittedButton") {
            alert("Please submit your other edit first.");
        }
    });


}

/* function: handleEditExercise
 * params: none 
 * returns: none
 * description: ties an event listener for the submit event to tableForm; 
 * changes the inputs for the record to editable, and when the user clicks
 * the edit button again, updates the record in the table as well as the record in the mysql database
 */
function handleEditExercise(){
    var handler;
    document.querySelector("#tableForm").addEventListener('submit', handler = function(event){
        var button = document.querySelector("#submittedButton");
        event.preventDefault();
        var row = button.parentElement.parentElement;

        if(button.name == 'edit'){
            button.innerHTML= 'Done';
            button.name = 'done';
        
            for(var i = 0; i < 5; i++){
                row.children[i].firstChild.removeAttribute('readonly'); 
            }
            row.children[3].firstChild.value = (row.children[3].firstChild.value == 'lbs' ? '1' : '0');
        } 
       
        else if(button.name == 'done'){
            if(validateDate(row.children[4].firstChild)){ 
                var payload = {};
                payload.id = row.children[7].firstChild.value;
                payload.exercise = row.children[0].firstChild.value; 
                payload.reps = row.children[1].firstChild.value; 
                payload.weight = row.children[2].firstChild.value; 
                payload.units = row.children[3].firstChild.value; 
                payload.date = row.children[4].firstChild.value; 

                var req = new XMLHttpRequest(); 
                req.open("POST", '/edit', true);
                req.setRequestHeader('Content-Type', 'application/json');
                req.addEventListener("load", function(event){
                    if(req.readyState == 4 && req.status >= 200 && req.status < 400){
                        console.log(req.responseText);
                        printTable();
                    } else {
                        console.log("Something went wrong. Error: " + req.status + ".");
                    }
                });
                req.send(JSON.stringify(payload)); 
                
                for(var i = 0; i < 5; i++){
                    row.children[i].firstChild.setAttribute('readonly', 'readonly'); 
                } 
                button.name = "edit";
                button.innerHTML= "Edit"; 
                button.removeAttribute("id");
            }
        }
    });

}

/*
function resetTable(){
    var resetReq = new XMLHttpRequest();
    resetReq.open("GET", "/reset-table", true);
    resetReq.addEventListener("load", function(){
        if(resetReq.readyState == 4 && resetReq.status >=200 && resetReq.status < 400){
            printTable();
        } else {
            console.log("Something isn't right. Error: " + req.status + ".");
        }
    });
    resetReq.send(null);
}
*/

/* function: handleDeleteExercise
 * params: event - click event tied to the button that call this function;
 * button - the button which this function is tied to
 * returns: none
 * description: when the delete button is clicked, an AJAX request is made to the
 * database; if the record is successfully deleted from the database, it is
 * also removed from the html table
 */
function handleDeleteExercise(event, button){
    var row = button.parentElement.parentElement;
    var q = '?id=' + row.children[7].firstChild.value;
    var req = new XMLHttpRequest();
    req.open('GET', '/delete' + q, true);
    req.addEventListener('load', function(){
        if(req.readyState == 4 && req.status >= 200 && req.status < 400){
            row.remove();
            printTable();
        } else {
            console.log("Something isn't right. Error: " + req.status + ".");
        }
    });
    req.send(null);
}

/* function: handleNewExerciseEvent
 * params: none
 * returns: none
 * description: sends an AJAX request to the database when the newExerciseForm
 * is submitted. if the form values are succesfully inserted into the database,
 * the updated html table is printed.
 */                                                  
function handleNewExerciseEvent(){
    document.querySelector("#newExerciseForm").addEventListener("submit", function(event){
        event.preventDefault();

        var form = document.querySelector("#newExerciseForm");
        if(validateDate(form.date)){
            var payload = {};
            payload.params = [];
            payload.params.push(null);
            payload.params.push(form.elements['exercise'].value); 
            payload.params.push(form.elements['reps'].value); 
            payload.params.push(form.elements['weight'].value); 
            payload.params.push(form.elements['date'].value); 
            payload.params.push(form.elements['units'].value); 

            var req = new XMLHttpRequest(); 
            req.open('POST', '/new', true);
            req.setRequestHeader('Content-Type', 'application/json');
            req.addEventListener("load", function(event){
                if(req.readyState == 4 && req.status >= 200 && req.status < 400){
                    //appendToExerciseRecords(JSON.parse(req.responseText));
                    printTable();
                } else {
                    console.log("Something isn't right Error: " + req.status + ".");
                }
            });
            req.send(JSON.stringify(payload));
       }
    });

}


window.addEventListener("load", function(){
    printTable();
    handleEditExercise();
    handleNewExerciseEvent();
   });
