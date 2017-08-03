var express = require('express');
var app = express();


var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));


var mysql = require('mysql');
var pool = mysql.createPool({
    host: 'localhost',
    user: 'cs290_garouttc',
    password: 'RottenDrubs79',
    database: 'cs290_garouttc'
});

app.set('port', 50918);

app.get("/new", function(req, res){
    console.log("GOT A REQUEST");
    res.send("asdf");
});


app.listen(app.get('port'), function(){
	console.log("Express started on port:" + app.get('port') + 
	"; press Ctrl-C to terminate.");
});

