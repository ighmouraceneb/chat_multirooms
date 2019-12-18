
import cons from 'consolidate';
import express from 'express';
import path from 'path';
import http from 'http';
import socket from 'socket.io';
import serveStatic from 'serve-static';
import swig from 'swig';
import {Message} from './app/models/modelMessage';



const app = express();
const port = 5555;
const server = http.createServer(app);
const io = socket.listen(server);
let messages = [];
let msgcss = new Message('salut css', 'css');
let msgjs = new Message('salut js', 'javascript');
let msggeneral = new Message('salut tout le monde', 'html');

 messages.push(msgcss);
 messages.push(msgjs);
 messages.push(msggeneral);
 console.log(messages);

// serving static files (style,image...)
app.use(serveStatic('public'));
//app.use(express.static(__dirname+'/public'));

// This is where all the magic happens!
app.engine('html', swig.renderFile);

app.set('view engine', 'html');
app.set('views', __dirname + '/views');

// assign the swig engine to .html files
/*app.engine('html',cons.swig);
app.engine('html', cons.swig.renderFile);

app.set('views', path.join(__dirname, 'views'));
app.set('views', './views');
// set .html as the default extension
app.set('view engine', 'html');*/

// Swig will cache templates for you, but you can disable
// that and use Express's caching instead, if you like:
app.set('view cache', false);
// To disable Swig's cache, do the following:
swig.setDefaults({ cache: false });



let rm = "";
app.get('/', (req, res) => {
	rm = 'home';
	res.render('index', {messages, rm});
});

app.get('/javascript', (req, res) => {
	rm = 'javascript';
	res.render('javascript', {messages, rm});
});
app.get('/css', (req, res) => {
	rm = 'css';
	res.render('css', {messages, rm});
});
app.get('/html', (req, res) => {
	rm = 'html';
	res.render('html', {messages, rm});
});
// tech namespace
const tech = io.of('/tech');

tech.on('connection', (socket) => {

    socket.on('join', (data) => {
    	rm = data.room
    	console.log(data, rm);
    	socket.join(data.room);
    	tech.in(data.room).emit('message', `New user joined ${data.room} room!`);

    })

    socket.on('message', (data) => {
        console.log(`message: ${data.newMsg}`);

        messages.push(new Message(data.newMsg, data.room));
        tech.in(data.room).emit('message', data.newMsg);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
        tech.emit('message', 'user disconnected');
    })
})

//start sever
server.listen(port, () => {
	console.log(`Server  in running on port ${port}`)
});