var express = require("express");
var mysql = require("mysql")
var cors = require("cors")

var app = express();

app.use(express.static('public'));

//make way for some custom css, js and images
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/images', express.static(__dirname + '/public/images'));

var server = app.listen(80, function(){
    var port = server.address().port;
    console.log("Server started at http://localhost:%s", port);
});

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:80');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(cors())


var connection = mysql.createConnection({
    host: "REDACTED",
    user: "REDACTED",
    password: "REDACTED",
    database: "REDACTED",
    port: "REDACTED"
});

var dataCache = {}
function fetchMysql(){

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
}
fetchMysql();
var minutes = 60;
var interval = minutes * 60 * 1000;
setInterval(fetchMysql, interval);

module.exports = {
    dataCache: dataCache
}



