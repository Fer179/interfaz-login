import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { usuarios } from '../controllers/authentication.controllers.js';
dotenv.config();

function soloAdmin(req, res, next) {
    const logueado = revisarCookie(req);
    if (logueado) return next();
    return res.redirect('/');
}

function soloPublico(req, res, next) {
    const logueado = revisarCookie(req);
    if (!logueado) return next();
    return res.redirect('/admin');
}

function revisarCookie (req) {
    try {
        const cookieJWT = req.headers.cookie?.split(';').find(cookie => cookie.trim().startsWith('jwt=')).slice(4);
        const decodificada = jwt.verify(cookieJWT, process.env.JWT_SECRET);
        console.log("Decodificada: ", decodificada);
        const userExists = usuarios.find(user => user.user === decodificada.username);
        console.log("User exists: ", userExists);
        if (!userExists) {
            return false;
        }
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}


export const methods = {
    soloAdmin,
    soloPublico
}
