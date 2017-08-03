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
    host: 'localhost',
    user: 'cs290_garouttc',
    password: 'RottenDrubs79',
    database: 'cs290_garouttc'
});

app.set('port', 50918);

app.get("/", function(req, res){
    var context = {};
    res.render('index', context);
});

app.post("/new", function(req, res){
   var context = {};
  console.log(req); 
    mysql.pool.query("INSERT INTO workouts (*) VALUES(?)", req.body.exercise,
            req.body.reps, req.body.weight, req.body.lbs, req.body.date, 
           function(err, result, fields){
              if(err){
                 throw err;
              } else {
                 console.log("values inserted successfully");
              }

    res.send(context);
           }); 
});


app.listen(app.get('port'), function(){
	console.log("Express started on port:" + app.get('port') + 
	"; press Ctrl-C to terminate.");
});

