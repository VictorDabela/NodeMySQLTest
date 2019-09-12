const express = require('express');
const routes = express.Router();

routes.get('/home', (req, res) => {
    return res.send('Opa você!');
});

module.exports = routes;