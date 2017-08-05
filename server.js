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
    var context = {};
    res.render("index", context);
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
    pool.query("INSERT INTO workouts VALUES(?)", [req.body.params],
           function(err, result, fields){
               if(err){
                   throw err;
               } 
               console.log("Values " + result.insertId +
               req.body.params + "succesfully inserted into table 'workouts'");
               pool.query("SELECT * FROM workouts WHERE id=" + result.insertId, function(err, result, field){
                   console.log(result);
                   res.send(JSON.stringify(result[0]));
               });
            }); 
});

app.post("/edit", function(req, res){
    pool.query("UPDATE workouts " +
           "SET name=" + req.body.exercise + ", reps=" + req.body.reps + 
           ", weight=" + req.body.weight + ", lbs=" + req.body.lbs + ", date=" + req.body.date +
           " WHERE id = " + req.body.id, function(err, result, fields){
        if(err){
            throw err;
        }
        console.log("Record with id " + req.body.id + " updated succesfully.");
        res.send("OK.");
    });
});

app.get("/delete", function(req, res){
    pool.query("DELETE FROM workouts WHERE id=" + req.query.id, function(err, result, fields){
        if(err){
            throw err;
        }
        console.log("Record with id " + req.query.id + " deleted from table workouts.");
        res.send("OK");
    });
});

app.listen(app.get('port'), function(){
	console.log("Express started on port:" + app.get('port') + 
	"; press Ctrl-C to terminate.");
});

