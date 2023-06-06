/*****************************************************
 *     КОМПОНЕНТ СОДЕРЖИТ В СЕБЕ СТАРТОВОЕ МЕНЮ,     *
 * СЛУЖИТ СТАРТОВОЙ ТОЧКОЙ UX ИНТЕРФЕЙСА ПРИЛОЖЕНИЯ, *
 *     ОТСЮДА ЮЗЕР МОЖЕТ ПОПАСТЬ НАПРЯМУЮ В ЧАТ      *
 *****************************************************/

import { Link } from 'react-router-dom';
import { useState } from 'react';
import styles from '../styles/Main.module.css';

const FIELDS = {
  NAME: 'name',
  ROOM: 'room',
};

const Main = () => {
  const { NAME, ROOM } = FIELDS;
  const [values, setValues] = useState({
    [NAME]: '',
    [ROOM]: '',
  });

  const handleChange = ({ target: { value, name } }) => {
    setValues({ ...values, [name]: value });
  };

  const sendUserJoin = () => {
    const user = {
      name: values[NAME],
      room: values[ROOM],
      event: 'Join',
    };

    fetch('http://127.0.0.1:5001/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(user),
    });
  };

  const handleClick = (e) => {
    const isDisabled = Object.values(values).some((values) => !values);

    sendUserJoin();

    if (isDisabled) {
      e.preventDefault();
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.container}>
        <h1 onClick={sendUserJoin} className={styles.heading}>
          Join
        </h1>
        <form className={styles.form}>
          <div className={styles.group}>
            <input
              type="text"
              name="name"
              placeholder="Username"
              value={values[NAME]}
              className={styles.input}
              onChange={handleChange}
              autoComplete="off"
              required
            />
          </div>
          <div className={styles.group}>
            <input
              type="text"
              name="room"
              placeholder="Room"
              value={values[ROOM]}
              className={styles.input}
              onChange={handleChange}
              autoComplete="off"
              required
            />
          </div>

          <Link onClick={handleClick} to={`/chat?name=${values[NAME]}&room=${values[ROOM]}`}>
            <button className={styles.button} type="submit">
              Sign in
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Main;
