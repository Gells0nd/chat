/*******************************************
 * РОУТЕР ВСЕГО ПРИЛОЖЕНИЯ, БЛАГОДАРЯ НЕМУ *
 *  РАБОТАЕТ ВСЯ НАВИГАЦИИ ПО ПРИЛОЖЕНИЮ,  *
 * А ИМЕННО ПЕРЕХОД К ЧАТУ И ВЫХОД ИЗ НЕГО *
 *******************************************/

import { Routes, Route } from 'react-router-dom';
import Main from './Main';
import Chat from './Chat';
import Auth from './Auth';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="/log" element={<Main />} />
      <Route path="/chat" element={<Chat />} />
    </Routes>
  );
};

export default AppRoutes;
