import express from 'express';
const functionsRouter = express.Router();
const appController = require('../controllers/appController');

const jwt = require('jsonwebtoken');

const authenticate = (req: any, res: any, next: any) => {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
        res.status(401).send({ message: "Acess denied" });
    } else {
        const accessToken: string = authorizationHeader.split(' ')[1];
        try {
            jwt.verify(accessToken, 'shhhhh');
            next();
        } catch (err: any) {
            if (err.name === 'TokenExpiredError') {
                res.status(401).send({ message: "TokenExpiredError" });
            } else {
                const error = new Error("Error! Something went wrong.");
                return next(error);
            }
        }
    }
}

functionsRouter.get('/obtenerTareas/:username', authenticate, appController.obtenerTareas);
functionsRouter.put('/insertarTareas/:username', authenticate, appController.insertarTareas);

module.exports = functionsRouter;