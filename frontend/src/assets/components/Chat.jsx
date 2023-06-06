/*************************************************************
 *   ОСНОВНОЙ КОМПОНЕНТ ЧАТА, СОДЕРЖИТ В СЕБЕ ПОДКЛЮЧЕНИЕ    *
 * ВСЕХ ДОЧЕРНИХ КОМПОНЕНТОВ, ТАКИХ КАК БЛОК ДЛЯ СООБЩЕНИЙ,  *
 *   А ТАК ЖЕ ВЫПОЛНЯЕТ ФУНКЦИЮ ОДНОГО ИЗ ГЛАВНЫХ ЭКРАНОВ    *
 * ПРИЛОЖЕНИЯ, ПЕРЕНАПРАВЛЕНИЕ СЮДА ИДЕТ ПРИ ПОМОЩИ РОУТИНГА *
 *              !  @AUTHOR: НИКОЛАЙ ДЕМИДОВ                  *
 *************************************************************/

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import EmojiPicker from 'emoji-picker-react';

import Messages from './Messages';
import styles from '../styles/Chat.module.css';
import icon from '../images/emoji.svg';

const socket = io.connect('http://localhost:5001');

const Chat = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const [params, setParams] = useState({ room: '', user: '' });
  const [state, setState] = useState([]);
  const [message, setMessage] = useState('');
  const [isOpen, setOpen] = useState(false);
  const [users, setUsers] = useState(0);

  useEffect(() => {
    const searchParams = Object.fromEntries(new URLSearchParams(search));
    setParams(searchParams);

    socket.emit('join', searchParams);
  }, [search]);

  useEffect(() => {
    socket.on('message', ({ data }) => {
      setState((_state) => [..._state, data]);
    });
  }, []);

  useEffect(() => {
    socket.on('room', ({ data: { users } }) => {
      setUsers(users.length);
    });
  }, []);

  const sendUserOut = () => {
    const user = {
      name: params.name,
      room: params.room,
      event: 'Leave',
    };

    fetch('http://127.0.0.1:5001/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(user),
    });
  };

  const leftRoom = () => {
    socket.emit('leftRoom', { params });
    sendUserOut();
    navigate('/log');
  };

  const handleChange = ({ target: { value } }) => setMessage(value);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message) return;

    socket.emit('sendMessage', { message, params });
    setMessage('');
  };

  const clearMessages = () => {
    setState([]);
  };

  const onEmojiClick = ({ emoji }) => setMessage(`${message} ${emoji}`);

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div className={styles.title}>{params.room}</div>
        <div className={styles.users}>{users} Users</div>
        <div>
          <button style={{ marginRight: '20px' }} className={styles.left} onClick={clearMessages}>
            Clear messages
          </button>
          <button className={styles.left} onClick={leftRoom}>
            Left the room
          </button>
        </div>
      </div>
      <div className={styles.messages}>
        <Messages messages={state} name={params.name} />
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.input}>
          <input
            type="text"
            name="message"
            placeholder="Message"
            value={message}
            className={styles.input}
            onChange={handleChange}
            autoComplete="off"
            required
          />
        </div>
        <div className={styles.emoji}>
          <img src={icon} onClick={() => setOpen(!isOpen)} alt="emoji" />

          {isOpen && (
            <div className={styles.emojies}>
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          )}
        </div>

        <div className={styles.button}>
          <input type="submit" onSubmit={handleSubmit} value="Send" />
        </div>
      </form>
    </div>
  );
};

export default Chat;
