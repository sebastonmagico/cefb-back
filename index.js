/**
*	Main declarations
*/
var express = require("express");
var bodyParser = require("body-parser");

var app = express();


var allowMethods = function(req, res, next) {
    res.header('Access-Control-Allow-Methods', "GET, POST, PUT, DELETE, OPTIONS"); next();
}

var tokenAuth = function(req, res, next) {
    if (req.headers.token === "password1234") {
   	 return next();
	}else{
		return res.status(401).send('Not authorized. Token not found');
	}
};


var allowCrossTokenHeader = function(req, res, next) {
	res.header('Access-Control-Allow-Headers', 'token');
	next();
}

/**
 * App main config
 */
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(allowMethods);
app.use(allowCrossTokenHeader);
app.use(tokenAuth);


//Routing
app.use(require('./router/user'));
app.use(require('./router/books'));

//Let's start
app.listen(3000, function(){
	console.log('parece que chuta');
})



