import bcryptjs from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const usuarios = [{
        user: "admin",
        email: "admin@gmail.com",
        password: "$2b$05$4/ir1ZSWhWL/pSMgfVWf6OYO/dVQhLbl2i5kExLeBzYRSpmaFJwBK"
}]

async function login(req, res) {
    console.log(req.body);
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(400).send({status: "Error", message: 'Los campos estan incompletos' });
    }
    const userExists = usuarios.find(user => user.user === username);
    if (!userExists) {
        return res.status(400).send({status: "Error", message: 'Error al iniciar sesión' });
    }
    const loginSuccess = await bcryptjs.compare(password, userExists.password);
    console.log(loginSuccess);
    if (!loginSuccess) {
        return res.status(400).send({status: "Error", message: 'Error al iniciar sesión' });
    }
    const token = jsonwebtoken.sign(
        { username: userExists.user }, 
        process.env.JWT_SECRET, 
        { expiresIn: process.env.JWT_EXPIRATION }
    );
    const cookieOptions = {
        expires: new Date(Date.now() + (process.env.JWT_COOKIE_EXPIRES) * 24 * 60 * 60 * 1000),
        path: '/',
    }
    res.cookie('jwt', token, cookieOptions);
    res.status(200).send({status: "Success", message: `Usuario ${username} ha iniciado sesión correctamente`, redirect: '/admin' });
}

async function register(req, res) {
    console.log(req.body);
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    if (!username || !email || !password) {
        return res.status(400).send({status: "Error", message: 'Los campos estan incompletos' });
    }
    const userExists = usuarios.find(user => user.user === username);
    if (!userExists) {
        return res.status(400).send({status: "Error", message: 'Error al iniciar sesión' });
    }

    const salt = await bcryptjs.genSalt(5);
    const hashedPassword = await bcryptjs.hash(password, salt);
    const newUser = {
        user: username,
        email: email,
        password: hashedPassword
    }
    console.log(usuarios);
    usuarios.push(newUser);
    return res.status(201).send({status: "Success", message: `Usuario ${username} registrado correctamente`, redirect: '/' });
}

export const methods = {
    login,
    register
}