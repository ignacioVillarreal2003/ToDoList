import express from 'express'
import { IUsuario } from './IUsuario';
import { ITarea } from './ITarea';

require('dotenv').config();

const app = express();
const PORT = 3000;


/* Configuracion de servidor */
const cors = require('cors');

var corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200,
    methods: "GET, PUT, POST, DELETE"
};

app.use(cors(corsOptions));
app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})


/* Generar tokens */
const jwt = require('jsonwebtoken');

function generateAccessToken(username: string) {
    return jwt.sign({ user: username }, 'shhhhh', { expiresIn: '1h' });
}


/* mongoose */
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGOSTRING)
    .then(() => console.log('Connected!'));


/* Middleware */
export function authenticate(req: any, res: any, next: any) {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
        return res.status(401).send({
            message: "Unauthorized"
        });
    } else {
        const token: string = authorizationHeader.split(' ')[1];
        try {
            jwt.verify(token, 'shhhhh');
            next();
        } catch (err: any) {
            if (err.name === 'TokenExpiredError') {
                res.status(401).send({
                    message: "TokenExpiredError"
                });
            } else {
                const error = new Error("Error! Something went wrong.");
                return next(error);
            }
        }
    }
}



app.post('/registrarUsuario', async (req, res) => {
    try {
        // Obtener usuario de la base de datos
        const username: string | null = await getUsuario(req.body.username).then((res) => {
            const usr = res[0]
            if (usr !== undefined) {
                return usr.username;
            } else {
                return null;
            }
        });
        // Verificar si el usuario ya está registrado
        if (username !== null) {
            res.status(400).send({ message: "El usuario ya está registrado." });
        } else {
            try {
                // Guardar el nuevo usuario en la base de datos
                postUsuario(req.body.username, req.body.password, req.body.listaTareas);
                // Se envía el token si todo está correcto
                const token = generateAccessToken(req.body.username);
                res.send({ token: token });
            } catch (error) {
                res.status(500).send({ message: "Error al hashear contraseña." });
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error al conectar a la BD." });
    }
});

app.post('/loguearUsuario', async (req, res) => {
    try {
        // Obtener usuario de la base de datos
        const usuario: IUsuario | null = await getUsuario(req.body.username).then((res) => {
            const usr = res[0]
            if (usr !== undefined) {
                const usrName = usr.username;
                const usrPass = usr.password;
                const usrLT = usr.listaTareas
                const user: IUsuario = {
                    username: usrName,
                    password: usrPass,
                    listaTareas: usrLT
                }
                return user;
            } else {
                return null;
            }
        });
        // Verificar si el usuario ya está registrado
        if (usuario !== null) {
            // compara contraseñas
            const match = req.body.password === usuario.password;
            if (req.body.username == usuario.username && match) {
                const token = generateAccessToken(req.body.username);
                // Se envía el token si todo está correcto
                res.send({ token: token });
            } else {
                res.status(400).send({ message: "Contraseña incorrecta." });
            }
        } else {
            res.status(400).send({ message: "El usuario no está registrado." });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error al conectar a la BD." });
    }
});


/* Tareas */
app.post('/actualizarTarea', authenticate, async (req, res) => {
    const tareas: ITarea[] = req.body.tareas
    try {
        const username: string | null = await getUsuario(req.body.username).then((res) => {
            const usr = res[0]
            if (usr !== undefined) {
                return usr.username;
            } else {
                return null;
            }
        });
        if (username != null) {
            putTarea(tareas, req.body.username)
            res.status(200).send({ message: "Tareas actualizadas." });
        } else {
            res.status(400).send({ message: "El usuario no está registrado." });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error al conectar a la BD." });
    }
});

app.get('/obtenerTareas/:username', authenticate, async (req, res) => {
    try {
        const username = req.params.username;
        const tarea: ITarea | null = await getUsuario(username).then((res) => {
            const usr = res[0]
            if (usr !== undefined) {
                return usr.listaTareas;
            } else {
                return null;
            }
        });       
        if (tarea != null) {
            res.status(200).send({ tareas: tarea });
        } else {
            res.status(400).send({ message: "El usuario no está registrado." });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error al conectar a la BD." });
    }
});




// Usuario
var userSchema = mongoose.Schema({
    username: String,
    password: String,
    listaTareas: []
});

const Usuario = mongoose.model('Usuario', userSchema, 'Usuarios');

const getUsuario = async (username: string) => {
    try {
        const usuario = await Usuario.find({ username: { $eq: username } });
        if (usuario) {
            return usuario;
        } else {
            return null;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
};

function postUsuario(username: string, password: string, listaTareas: ITarea[]): boolean {    
    const usuario = new Usuario({
        username: username,
        password: password,
        listaTareas: listaTareas
    });
    usuario.save()
        .then(() => {
            return true;
        })
        .catch((err: any) => {
            return false;
        });
    return false;
}

const putTarea = async (listaTareas: ITarea[], username: string) => {
    try {
        const usuario = await Usuario.findOneAndUpdate(
            { username: { $eq: username } },
            { listaTareas: listaTareas },
            { new: true }
        );
        if (usuario) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}