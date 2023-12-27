const appService = require('../services/appService');

const registrarUsuario = async (req: any, res: any) => {
    try {
        const { body } = req;        
        if (!body.username || !body.password) {
            return res.status(500).send({ message: "Error al procesar la solicitud." });
        } else {                        
            const result = await appService.registrarUsuario(body.username, body.password, body.listaTareas);
            if (result.message) {
                res.status(result.status).send({ message: result.message })
            } else {
                res.status(result.status).send({ token: result.token })
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error al procesar la solicitud." });
    }
}

const loguearUsuario = async (req: any, res: any) => {
    try {
        const { body } = req;
        if (!body.username || !body.password) {
            res.status(500).send({ message: "Error al procesar la solicitud." });
        } else {
            const result = await appService.loguearUsuario(body.username, body.password, body.listaTareas);
            if (result.message) {
                res.status(result.status).send({ message: result.message })
            } else {
                res.status(result.status).send({ token: result.token })
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error al procesar la solicitud." });
    }
}

const obtenerTareas = async (req: any, res: any) => {
    try {
        const { params: { username } } = req;
        if (!username) {
            res.status(500).send({ message: "Error al procesar la solicitud." });
        } else {
            const result = await appService.obtenerTareas(username);
            if (result.message) {
                res.status(result.status).send({ message: result.message })
            } else {
                res.status(result.status).send({ tareas: result.tareas })
            }
        } 
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error al procesar la solicitud." });
    }
}

const insertarTareas = async (req: any, res: any) => {
    try {
        const { body, params: { username } } = req;
        if (!username) {
            res.status(500).send({ message: "Error al procesar la solicitud." });
        } else {
            const result = await appService.insertarTareas(username, body.tareas);
            if (result.message) {
                res.status(result.status).send({ message: result.message })
            } else {
                res.status(result.status).send({ usuarioIngresado: result.usuarioIngresado })
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error al procesar la solicitud." });
    }
}

module.exports = {
    obtenerTareas,
    registrarUsuario,
    loguearUsuario,
    insertarTareas
}