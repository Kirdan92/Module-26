const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const UsersService = require('./UsersService');
const usersService = new UsersService();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(`${__dirname}/public`));

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

io.on('connection', (socket) => {
	//funkcje wykonywane po podłączeniu klienta
	//nasłuchiwanie na wiadomosc wejscia do czatu
	socket.on('join', (name) => {
		//user dodawany jest do listy uzytkowników
		usersService.addUser({
			id: socket.id,
			name
		});
		//update listy uzytkownikow dla kazdego podłączonego
		io.emit('update', {
			users: usersService.getAllUsers()
		});
	})
	socket.on('disconnect', () => {
		usersService.removeUser(socket.id);
		socket.broadcast.emit('update', {
			users: usersService.getAllUsers()
		});
	});
	socket.on('message', (message) => {
		const {name} = usersService.getUserById(socket.id);
		socket.broadcast.emit('message', {
			text: message.text,
			from: name
		});
	});
});


server.listen(3000, () => {
  console.log('listening on *:3000');
});