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

var session = require('express-session');
app.use(session({
    secret: 'CS290FinalProjectSecret',
    resave: true,
    saveUninitialized:true
}));

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

    if(!req.session.name){
        res.render('login', context);
        return;
    }

    if(req.session.name){
        //context.script = '
        context.name = req.session.name;
        res.render('index', context);
    }
});

app.post('/', function(req, res){
    if(req.body['loginName']){
        req.session.name = req.body['loginName'];
        var context = {};
        console.log(req.body['loginName']);
        context.name = req.body['loginName'];
        res.render('index', context);
    }
});

app.get('/get-list', function(req, res, next){
    pool.query('SELECT * from workouts where name="' + 
            req.query.name + '"', function(err, result, fields){
                if(err){
                    throw err;
                }
                res.send(result);
            });
});

app.get('/reset-table',function(req,res,next){
    var context = {};
    pool.query("DROP TABLE IF EXISTS workouts", function(err){
        var createString = "CREATE TABLE workouts("+
            "id INT PRIMARY KEY AUTO_INCREMENT,"+
            "exercise VARCHAR(255) NOT NULL,"+
            "reps INT,"+
            "weight INT,"+
            "date DATE,"+
            "units BOOLEAN,"+
            "name VARCHAR(255) NOT NULL)";
        pool.query(createString, function(err){
            context.results = "Table reset";
            res.render('index',context);
        })
    });
});

app.post("/new", function(req, res){
    req.body.params.push(req.session.name);
    pool.query("INSERT INTO workouts VALUES(?)", [req.body.params],
           function(err, result, fields){
               if(err){
                   throw err;
               } 
               console.log("Values " + result.insertId +
               req.body.params + "succesfully inserted into table 'workouts'");
               pool.query("SELECT id, exercise, reps, weight, DATE_FORMAT(date, " 
                       + "'%M %d, %Y') as dateF, units FROM workouts WHERE id=" 
                       + result.insertId, function(err, result, field){
                   if(err){
                       throw err;
                   }
                   console.log(result[0]);
                   res.send(JSON.stringify(result[0]));
               });
            }); 
});

app.post("/edit", function(req, res){
    pool.query("UPDATE workouts " +
           "SET exercise='" + req.body.exercise + "', reps=" + req.body.reps + 
           ", weight=" + req.body.weight + ", date='" + req.body.date + "', units=" + req.body.units +
           " WHERE id = " + req.body.id, function(err, result, fields){
        if(err){
            throw err;
        }
        console.log(fields);
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

