/***************************************
 * КОРНЕВОЙ КОМПОНЕНТ, СОДЕРЖИТ В СЕБЕ *
 *     ТОЛЬКО РОУТЕР ДЛЯ НАВИГАЦИИ     *
 ***************************************/

import AppRoutes from './AppRoutes';

const App = () => {
  return (
    <div className="container">
      <AppRoutes />
    </div>
  );
};

export default App;
