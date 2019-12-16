
import cons from 'consolidate';
import express from 'express';
import path from 'path';
import http from 'http';
import socket from 'socket.io';
import serveStatic from 'serve-static';


const app = express();
const port = 5555;
const server = http.createServer(app);
const io = socket.listen(server);
let messages = [];

// serving static files (style,image...)
//app.use(serveStatic('public'));
app.use(express.static(__dirname+'/public'));



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

	// emit old msg
	socket.emit('message:init', messages);

	//emit un message where user is disconnected
	socket.on('disconnect', () => {
		console.log('user disconnected');
		io.emit('message', 'user disconnected');
	});

	//get new message end emit it 
	socket.on('message:add',(newMsg) => {
		messages.push(newMsg);	
		socket.broadcast.emit("messages:get",newMsg );
	})
	
	//emit un message where user is connected
	socket.on('message', (msg) => {
		io.emit('message', msg);
	})

});

//start sever
server.listen(port, () => {
	console.log(`Server  in running on port ${port}`)
});