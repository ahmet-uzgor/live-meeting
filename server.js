const  express = require('express');
const app = express();
const { ExpressPeerServer } = require('peer');
const path = require('path');
const server = require('http').Server(app);
const indexRouter = require('./routes/index');

// peer.js setup
const peerServer = ExpressPeerServer(server, {
    debug: true,
});

app.use('/peerjs', peerServer);

// view engine steup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

/**
 * socket-io config
*/
const socketApi = require('./src/socketApi');
const io = socketApi.io;

io.attach(server);

// routes
app.use('/', indexRouter);

server.listen(3023)