"use strict";

var express = require('express');
var app = express();

var handlebars = require('express-handlebars').create({defaultLayout: "main"});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'classmysql.engr.oregonstate.edu',
    user: 'cs290_garouttc',
    password: 'RottenDrubs79',
    database: 'cs290_garouttc'
});


app.set('port', 50918);

app.get("/", function(req, res){
    console.log("yabado");
});

app.get('/reset-table',function(req,res,next){
    var context = {};
    pool.query("DROP TABLE IF EXISTS workouts", function(err){
        var createString = "CREATE TABLE workouts("+
            "id INT PRIMARY KEY AUTO_INCREMENT,"+
            "name VARCHAR(255) NOT NULL,"+
            "reps INT,"+
            "weight INT,"+
            "date DATE,"+
            "lbs BOOLEAN)";
        pool.query(createString, function(err){
            context.results = "Table reset";
            res.render('index',context);
        })
    });
});

app.post("/new", function(req, res){
    var context = {};
    pool.query("INSERT INTO workouts VALUES(?)", [req.body.exercise,
            req.body.reps, req.body.weight, req.body.lbs, req.body.date],
           function(err, result, fields){
              if(err){
                 throw err;
              } else {
                 console.log("values inserted successfully");
              }
            }); 
    res.render('index', context);
    
});


app.listen(app.get('port'), function(){
	console.log("Express started on port:" + app.get('port') + 
	"; press Ctrl-C to terminate.");
});

