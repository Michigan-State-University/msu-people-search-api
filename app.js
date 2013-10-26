var express = require('express'),
    app = express();

//Some Server configuration
app.use(express.bodyParser());

app.get('/', function(req, res) {
  var text = "Hello World!";
  res.send(text);
});

app.get('/api/1/users', function(req, res) {
  var text = "Hello World!";
  res.send(text);
});


//Start the app
app.listen(8080);