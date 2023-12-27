import { ITarea } from "./ITarea";

export interface IUsuario{
    username: string,
    password: string,
    listaTareas: ITarea[],
    createdAt: string,
    updateAt: string
}