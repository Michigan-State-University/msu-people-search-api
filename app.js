var express = require("express");
var ldap = require('ldapjs');
var fs = require('fs');
var crypto = require('crypto');

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

app.get('/api', function(request, response){
   fs.readFile('MSU-People-Search-API.raml', function(err, data){
      if(err)
        throw err;
       var output = data.toString();
       response.set('Content-Type', 'text/plain');
       response.send(output);
   });
});

app.get('/api/1/persons', function(request, response) {
    opts.filter = '&';

    if(request.query.firstname !== undefined){
        opts.filter += '(givenName=' + request.query.firstname + '*)';
    }
    if(request.query.lastname !== undefined){
        console.log(request.query.lastname);
        opts.filter += '(sn=' + request.query.lastname + '*)';
    }
    if(request.query.msunetid !== undefined){
        console.log(request.query.msunetid);
        opts.filter += '(uid=' + request.query.msunetid + '*)';
    }
    if(opts.filter === '&'){
        response.json(500, { error:
            'Please put in a firstname, lastname, or msunetid to search' })
    }
    console.log('Filter', opts.filter);
    client.search('dc=msu,dc=edu', opts, function(err, res) {
        var people = [];
        res.on('searchEntry', function(entry) {
            console.log(entry.object);
            var email = '';
            if(entry.object.mail !== undefined){
                email = entry.object.mail.toString().toLowerCase();
            }
            var shasum = crypto.createHash('md5').update(email).digest('hex');
            var person = {
                firstName: entry.object.givenName,
                lastName: entry.object.sn,
                title: entry.object.title,
                employeeType: entry.object.employeeType,
                email: entry.object.mail,
                department: entry.object.departmentNumber,
                msunetid: entry.object.uid,
                gravatar: 'http://www.gravatar.com/avatar/' + shasum
            };
            people.push(person);
        });
        res.on('error', function(err) {
            console.error('error: ' + err.message);
        });
        res.on('end', function(result) {
            console.log('status: ' + result.status);
            console.log(people.length);
            response.json({'users':people});
        });
    });

});

app.get('/api/1/persons/:msunetid', function(request, response) {
    var msunetid = request.params.msunetid;
    opts.filter = 'uid=' + msunetid;
    console.log('Filter', opts.filter);
    client.search('dc=msu,dc=edu', opts, function(err, res) {
        var people;
        res.on('searchEntry', function(entry) {

            var email = '';
            if(entry.object.mail !== undefined){
                email = entry.object.mail.toString().toLowerCase();
            }
            var shasum = crypto.createHash('md5').update(email).digest('hex');


            var person = {
                firstName: entry.object.givenName,
                lastName: entry.object.sn,
                title: entry.object.title,
                employeeType: entry.object.employeeType,
                email: entry.object.mail,
                department: entry.object.departmentNumber,
                msunetid: entry.object.uid,
                gravatar: 'http://www.gravatar.com/avatar/' + shasum
            };
            people = person;
        });
        res.on('error', function(err) {
            console.error('error: ' + err.message);
        });
        res.on('end', function(result) {
            console.log('status: ' + result.status);
            if(people === undefined){
                response.send(404);
            }
            response.json({'user': people});
        });
    });
});


//Start the app
app.listen(8080);
console.log('Server running on port 8080');
