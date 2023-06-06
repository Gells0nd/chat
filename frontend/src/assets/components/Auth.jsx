/*******************************************************
 * КОМПОНЕНТ ОТВЕСТВЕННЫЙ ЗА РЕГИСТРАЦИЮ И АВТОРИЗАЦИЮ *
 * ПОЛЬЗОВАТЕЛЕЙ, СЛУЖИТ ОТПРАВНОЙ ТОЧКОЙ ПРИЛОЖЕНИЯ,  *
 *             ИСПОЛЬЗУЕТ В СЕБЕ НАВИГАЦИЮ             *
 *           !  @AUTHOR: НИКОЛАЙ ДЕМИДОВ               *
 *******************************************************/

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Auth.module.css';

const Auth = () => {
  const navigate = useNavigate();

  const [loginLogin, setLoginLogin] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [registerLogin, setRegisterLogin] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const [regStatus, setRegStatus] = useState('');
  const [logStatus, setLogStatus] = useState('');

  const sendRegisterPost = () => {
    const user = {
      name: registerLogin,
      password: registerPassword,
    };

    fetch('http://127.0.0.1:5001/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(user),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.error === 'Пользователь с таким именем уже существует.') {
          setRegStatus('Пользователь уже существует.');
        }

        if (data.error === 'Пожалуйста, заполните все поля.') {
          setRegStatus('Пожалуйста, заполните все поля.');
        }

        if (data.message === 'Регистрация прошла успешно.') {
          setRegStatus('Успех!');
        }
      });
  };

  const sendLoginPost = () => {
    const user = {
      name: loginLogin,
      password: loginPassword,
    };

    fetch('http://127.0.0.1:5001/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(user),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        if (data.error === 'Неверное имя пользователя или пароль.') {
          setLogStatus('Неверное имя пользователя или пароль.');
        }

        if (data.message === 'Авторизация успешна.') {
          setLogStatus('Авторизация успешна.');
        }
      });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.login}>
        <h1 className={styles.loginTitle}>Авторизация</h1>
        <input
          onChange={(e) => setLoginLogin(e.target.value)}
          value={loginLogin}
          type="text"
          placeholder="Имя"
          className={styles.loginLogin}
        />
        <input
          onChange={(e) => setLoginPassword(e.target.value)}
          value={loginPassword}
          type="text"
          placeholder="Password"
          className={styles.loginPassword}
        />
        <button onClick={sendLoginPost} className={styles.loginBtn}>
          Войти
        </button>
        {logStatus && <p style={{ textAlign: 'center', marginBottom: '10px', color: '#fff' }}>{logStatus}</p>}

        {logStatus === 'Авторизация успешна.' ? navigate('/log') : ''}
      </div>
      {/* ------------------ */}
      <div className={styles.register}>
        <h1 className={styles.registerTitle}>Регистраиця</h1>
        <input
          onChange={(e) => setRegisterLogin(e.target.value)}
          value={registerLogin}
          type="text"
          placeholder="Имя"
          className={styles.registerLogin}
        />
        <input
          onChange={(e) => setRegisterPassword(e.target.value)}
          value={registerPassword}
          type="text"
          placeholder="Пароль"
          className={styles.registerPassword}
        />
        <button onClick={sendRegisterPost} className={styles.registerBtn}>
          Зарегестрироваться
        </button>
        {regStatus && <p style={{ textAlign: 'center', marginBottom: '10px', color: '#fff' }}>{regStatus}</p>}
      </div>
    </div>
  );
};

export default Auth;
