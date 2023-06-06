/******************************************
 * РОУТЕР СЕРВЕРНОЙ ЧАСТИ, СУЩЕСТВУЕТ ДЛЯ *
 *         ПЕРЕАДРЕСАЦИИ ЗАПРОСОВ         *
 ******************************************/

// TODO: Доделать роутер

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Это роутер');
});

module.exports = router;
