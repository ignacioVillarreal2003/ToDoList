import { ITarea } from "../interfaces/ITarea";
import { IUsuario } from "../interfaces/IUsuario";
require('dotenv').config();
const moment = require('moment-timezone');

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGOSTRING)
    .then(() => console.log('Connected!'));


var userSchema = mongoose.Schema({
    username: String,
    password: String,
    listaTareas: [],
    createdAt: String,
    updateAt: String
});

const Usuario = mongoose.model('Usuario', userSchema, 'Usuarios');


const getUsuario: (username: string) => Promise<IUsuario | null> = async (username: string) => {
    try {
        const usuario = await Usuario.find({ username: { $eq: username } });
        if (usuario && usuario.length > 0) {
            return usuario[0] as IUsuario;
        } else {
            return null;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
};

function postUsuario(username: string, password: string, listaTareas: ITarea[], createdAt: string, updateAt: string): boolean | null {
    try {
        const uruguayTime = moment().tz('America/Montevideo').format("YYYY-MM-DDTHH:mm:ss.SSSZ");
        const usuario = new Usuario({
            username: username,
            password: password,
            listaTareas: listaTareas,
            createdAt: uruguayTime,
            updateAt: uruguayTime
        });
        usuario.save()
            .then(() => {
                return true;
            })
            .catch((err: any) => {
                return false;
            });
        return false;
    } catch (error) {
        console.error(error);
        return null;
    }
}


const obtenerTareas: (username: string) => Promise<ITarea | null> = async (username: string) => {
    try {
        const usuario = await Usuario.find({ username: { $eq: username } });
        if (usuario && usuario.length > 0) {
            return usuario[0].listaTareas;
        } else {
            return null;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
};


const putTareas: (username: string, tareasNuevas: ITarea[]) => Promise<IUsuario | null> = async (username: string, tareasNuevas: ITarea[]) => {
    try {
        const uruguayTime: string = moment().tz('America/Montevideo').format("YYYY-MM-DDTHH:mm:ss.SSSZ");

        const usuario: IUsuario = await Usuario.findOneAndUpdate(
            { username: { $eq: username } },
            { listaTareas: tareasNuevas, updateAt: uruguayTime },
            { new: true }
        );
        if (usuario) {
            return usuario;
        } else {
            return null;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

module.exports = {
    getUsuario,
    postUsuario,
    obtenerTareas,
    putTareas
}