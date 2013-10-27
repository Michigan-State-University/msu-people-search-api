# README

## Installation

To use this application you will need to clone it to the system that you want to run it from. Next change to the directory and install the packages needed using `npm install` and then start the service using `pm2 start app.js`

Once the server starts you can browse to [http://localhost:8080/api/](http://localhost:8080/api/) for the API reference specification. 

To restart the currently running application use `pm2 restart all` or for a zero downtime reload use `pm2 reload all`.

To stop the application from running use `pm2 stop all`.
