var express = require("express");
var mysql = require("mysql")

var app = express();

app.use(express.static('public'));

//make way for some custom css, js and images
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/images', express.static(__dirname + '/public/images'));

var server = app.listen(8081, function(){
    var port = server.address().port;
    console.log("Server started at http://localhost:%s", port);
});


var connection = mysql.createConnection({
    host: "db-mysql-nyc3-40637-do-user-8764036-0.b.db.ondigitalocean.com",
    user: "doadmin",
    password: "d2cutvfrzegsc0zr",
    database: "centers",
    port: "25060"
});

var dataCache = {}

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    connection.query("SELECT * FROM places", function (err, result) {
        app.get('/data', function (req, res){

            if(err) throw err;
            for (var i = 0; i < result.length; i++){
                var item = result[i];
                dataCache[item.id] = [item.pname, item.address, item.phone, item.link, item.zip]
            }
            res.send(dataCache);
        })
    });

    console.log("Running 2 query")
    connection.query("SELECT * FROM vaccine_data", function (err, result1) {
        console.log("INside query")
        app.get('/vdata', function (req, res) {
            console.log("here")
            if(err){
                throw err;
            }
            var toSend = result1;
            console.log("Sending " + toSend)
            res.send(toSend)
        })
    });
});

module.exports = {
    dataCache: dataCache
}



