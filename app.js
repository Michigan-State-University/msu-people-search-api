var express = require("express");
var ldap = require('ldapjs');
var app = express();

var opts = {
    filter: '',
    scope: 'sub'
    };

var client = ldap.createClient({
  url: 'ldap://ldap.msu.edu:389'
    });

var imgURL = 'public/images/still-use-ie.jpg';
   
app.get('/', function(request, response){
    response.send('The number you\'re trying to reach has been disconnected' );
});

app.get('/api/1/users', function(req, res) {
  var text = "Hello World!";
  res.send(text);
});

app.get('/api/1/users/:msunetid', function(request, response) {
    var msunetid = request.params.msunetid;
    opts.filter = 'uid=' + msunetid;
    console.log('Filter', opts.filter);
    client.search('dc=msu,dc=edu', opts, function(err, res) {
        var people;
        res.on('searchEntry', function(entry) {
            //console.log('entry: ' + JSON.stringify(entry.object));
            //output += JSON.stringify(entry.object);
            var person = {firstName: entry.object.givenName,
                lastName: entry.object.sn,
                mail: entry.object.mail,
                employeeType: entry.object.employeeType,
                department: entry.object.department,
                title: entry.object.title,
                msuNetId: entry.object.uid};
                people = person;
                console.log(person);
        });
        res.on('error', function(err) {
            console.error('error: ' + err.message);
        });
        res.on('end', function(result) {
            console.log('status: ' + result.status);
            response.json({'user': people});
        });
    });
});


//Start the app
app.listen(8080);
console.log('Server running on port 8080');
