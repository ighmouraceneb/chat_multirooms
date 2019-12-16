
import cons from 'consolidate';
import express from 'express';
import path from 'path';
import http from 'http';
import socket from 'socket.io';


const app = express();
const port = 5555;
const server = http.createServer(app);
const io = socket.listen(server);

// assign the swig engine to .html files
app.engine('html',cons.swig);

app.set('views', path.join(__dirname, 'views'));
app.set('views', './views');
// set .html as the default extension
app.set('view engine', 'html');

app.get('/', (req, res) => {
	res.render('index.html');
});


io.on('connection', (socket) => {

	console.log('socket connected');

});

//start sever
server.listen(port, () => {
	console.log(`Server  in running on port ${port}`)
});