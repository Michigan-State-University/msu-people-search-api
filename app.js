var express = require('express'),
    app = express();

//Some Server configuration
app.use(express.bodyParser());


//Start the app
app.listen(8080);