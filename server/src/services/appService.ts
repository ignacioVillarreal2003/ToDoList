import { ITarea } from "../interfaces/ITarea";
import { IUsuario } from "../interfaces/IUsuario";

const usuarios = require('../database/usuarios');

const jwt = require('jsonwebtoken');

function generateAccessToken(username: string) {
    return jwt.sign({ user: username }, 'shhhhh', { expiresIn: '1h' });
}


const registrarUsuario = async (username: string, password: string) => {
    try {
        const existingUser = await usuarios.getUsuario(username);        
        if (existingUser) {
            return { status: 400, message: "El usuario ya está registrado." };
        } else {            
            const listaTareas: ITarea[] = []
            await usuarios.postUsuario(username, password, listaTareas);
            const token = generateAccessToken(username);
            return { status: 200, token: token };
        }
    } catch (error) {
        throw new Error("Error en el servicio al procesar la solicitud.");
    }
}

const loguearUsuario = async (username: string, password: string) => {
    try {
        const existingUser: IUsuario = await usuarios.getUsuario(username);
        if (!existingUser) {
            return { status: 400, message: "El usuario no está registrado." };
        } else {
            if (existingUser.password != password) {
                return { status: 400, message: "Contraseña incorrecta." };
            } else {
                const token = generateAccessToken(username);
                return { status: 200, token: token };
            }
        }
    } catch (error) {
        throw new Error("Error en el servicio al procesar la solicitud.");
    }
}

const obtenerTareas = async (username: string) => {
    try {
        const tareas = await usuarios.obtenerTareas(username);
        if (!tareas) {
            return { status: 400, message: "El usuario no está registrado." };
        } else {
            return { status: 200, tareas: tareas };
        }
    } catch (error) {
        throw new Error("Error en el servicio al procesar la solicitud.");
    }
}

const insertarTareas = async (username: string, tareasNuevas: ITarea[]) => {
    try {        
        const usuarioIngresado = await usuarios.putTareas(username, tareasNuevas);
        if (!usuarioIngresado) {
            return { status: 400, message: "El usuario no está registrado." };
        } else {
            return { status: 200, usuarioIngresado: usuarioIngresado };
        }
    } catch (error) {
        throw new Error("Error en el servicio al procesar la solicitud.");
    }
}

module.exports = {
    obtenerTareas,
    registrarUsuario,
    loguearUsuario,
    insertarTareas
}