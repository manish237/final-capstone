const http = require('http')
const express = require('express');
const app = express();
let server   = http.createServer(app);


const expressSession = require('express-session');
const config = require('./config');
const authRoutes = require('./server/routers/authRoutes');
const metaRoutes = require('./server/routers/metaRoutes');
const commonProfileRoutes = require('./server/routers/commonprofileroutes');
const consumerProfileRoutes = require('./server/routers/consumerprofileroutes');
const providerProfileRoutes = require('./server/routers/providerprofileroutes');
const messageRoutes = require('./server/routers/messageroutes');
const dietRoutes = require('./server/routers/userdietroutes');
const extRoutes = require('./server/routers/extRoutes');
const socketio = require('socket.io');
const socket = require('./server/routers/socket');


const morgan = require('morgan');
const mongoose = require('mongoose');


mongoose.Promise = global.Promise;
// *** mongoose *** ///
console.log(config.mongoURI[app.settings.env])
console.log(app.settings.env)
mongoose.connect(config.mongoURI[app.settings.env], {
                useMongoClient: true
                },function(err, res) {
                    if(err) {
                        console.log('Error connecting to the database. ' + err);
                    } else {
                        console.log('Connected to Database: ' + config.mongoURI[app.settings.env]);
                    }
});





app.use(morgan('common'));
app.use(express.static('public'));
app.use(expressSession({secret:"max",saveUninitialized:false,resave:false}))

app.use('/auth', authRoutes);
app.use('/profile/common', commonProfileRoutes);
app.use('/profile/consumer', consumerProfileRoutes);
app.use('/profile/provider', providerProfileRoutes);
app.use('/message', messageRoutes);
app.use('/meta', metaRoutes);
app.use('/ext', extRoutes);
app.use('/diet', dietRoutes);


/*
We will be just defining API routes. The application will be served by Angular
 */
app.get("/", (request, response) => {
    response.sendFile(__dirname + '/public/index.html');
});

let io = require('socket.io').listen(server);

app.use('/static', express.static('node_modules'));


server.listen(8080, function() {
    console.log("Node server running on http://localhost:8080");
});

/*
io.on('connection', function(client) {
    console.log('Client connected...');
    // console.log(client)

    client.on('join', function(data) {
        console.log(data);
    });

    client.on('messages', function(data) {
        client.emit('broad', data);
        client.broadcast.emit('broad',data);
    });

});
*/

io.sockets.on('connection', socket);
/*
function runServer(databaseUrl=config.DATABASE_URL, port=config.PORT) {
    return new Promise((resolve, reject) => {
        mongoose.connect(databaseUrl,{useMongoClient: true}, err => {
                if(err) {
                    console.log("unable to connect to the DB")
                    return reject(err);
                }
                io = socketio.listen(http.createServer(app))
                server = app.listen(port, () => {
                    console.log(`Your app is listening on port ${port}`);
                    resolve();
                }).on('error', err => {
                    mongoose.disconnect();
                    reject(err)
                });
            });
    });
}

function closeServer() {
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
            console.log('Closing server');
            server.close(err => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    });
}*/

/*if (require.main === module) {
    runServer()
        .then( () => {
            "use strict";
            io.on('connection', function(client) {
                console.log('Client connected...');
            });
        })
        .catch(err => {
            console.error(err)
    });
};*/

module.exports = app;
