/**********************************************
 *   КОРЕНЬ BACKEND ЧАСТИ, СОДЕРЖИТ В СЕБЕ    *
 * ПОДКЛЮЧЕНИЕ РОУТЕРА, НАСТРОЙКУ ВЕБСОКЕТОВ, *
 * СЛУЖИТ КОРНЕМ ДЛЯ НАПИСАНИЯ ВСЕХ ЗАПРОСОВ  *
 *        ! @AUTHOR: НИКОЛАЙ ДЕМИДОВ          *
 **********************************************/

const express = require('express');
const cors = require('cors');
const route = require('./route');
const http = require('http');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const { Server } = require('socket.io');
const { addUser, findUser, getRoomUsers, removeUser } = require('./users');

const app = express();
const PORT = 5001;

const db = new sqlite3.Database('./db.sqlite', (err) => {
  if (err) {
    console.log('DB Connection error: ' + err);
  } else {
    console.log('DB Connected!');
  }
});

// TODO: Сделать функцию создания
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS "users" ( name text, room text, time text, event text )');
  db.run('CREATE TABLE IF NOT EXISTS "reg" ( name text, password text, time text )');
});

app.use(
  cors({
    origin: '*',
  })
);
app.use(route);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const server = http.createServer(app);

app.post('/login', (req, res) => {
  const data = {
    name: req.body.name,
    password: req.body.password,
  };

  if (!data.name || !data.password) {
    return res.status(400).json({ error: 'Пожалуйста, заполните все поля.' });
  }

  db.get('SELECT * FROM reg WHERE name = ? AND password = ?', [data.name, data.password], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!row) {
      return res.status(401).json({ error: 'Неверное имя пользователя или пароль.' });
    }

    if (row) {
      return res.status(200).json({ message: 'Авторизация успешна.' });
    }
  });
});

// TODO: Допилить timestamp в бд
app.post('/register', (req, res) => {
  const data = {
    name: req.body.name,
    password: req.body.password,
    time: new Date().toLocaleString(),
  };

  if (!data.name || !data.password) {
    return res.status(400).json({ error: 'Пожалуйста, заполните все поля.' });
  }

  db.get('SELECT * FROM reg WHERE name = ?', [data.name], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (row) {
      return res.status(409).json({ error: 'Пользователь с таким именем уже существует.' });
    }

    db.run('INSERT INTO reg (name, password, time) VALUES (?, ?, ?)', [data.name, data.password, data.time], (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      return res.status(200).json({ message: 'Регистрация прошла успешно.' });
    });
  });
});

app.post('/create', (req, res) => {
  const data = {
    name: req.body.name,
    room: req.body.room,
    time: new Date().toLocaleString(),
    event: req.body.event,
  };

  try {
    db.run(`INSERT INTO users (name, room, time, event) VALUES(?, ?, ?, ?)`, [
      data.name,
      data.room,
      data.time,
      data.event,
    ]);
  } catch (err) {
    console.log('Error: ' + err);
    return res.sendStatus(400);
  }

  return res.sendStatus(200);
});

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  socket.on('join', ({ name, room }) => {
    socket.join(room);

    const { user, isExist } = addUser({ name, room });
    const userMessage = isExist ? `Ура, ${user.name}, вы вернулись!` : `Здравствуйте, ${user.name}!`;

    socket.emit('message', {
      data: {
        user: { name: 'Оповещение' },
        message: userMessage,
      },
    });

    socket.broadcast.to(user.room).emit('message', {
      data: {
        user: { name: 'Оповещение' },
        message: `${user.name} присоеденился к чату!`,
      },
    });

    io.to(user.room).emit('room', { data: { room: user.room, users: getRoomUsers(user.room) } });
  });

  socket.on('sendMessage', ({ message, params }) => {
    const user = findUser(params);

    if (user) {
      io.to(user.room).emit('message', { data: { user, message } });
    }
  });

  socket.on('leftRoom', ({ params }) => {
    const user = removeUser(params);

    if (user) {
      const { room, name } = user;
      io.to(user.room).emit('message', {
        data: { user: { name: 'Оповещение' }, message: `${user.name} покинул чат!` },
      });

      io.to(room).emit('room', { data: { room: user.room, users: getRoomUsers(room) } });
    }
  });

  io.on('disconnect', () => {
    console.log('Disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server started: http://127.0.0.1:${PORT}`);
});
