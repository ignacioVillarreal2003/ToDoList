import express from 'express';
const loguinRouter = express.Router();

const appController = require('../controllers/appController');

loguinRouter.post('/registrarUsuario', appController.registrarUsuario);
loguinRouter.post('/loguearUsuario', appController.loguearUsuario);


module.exports = loguinRouter;