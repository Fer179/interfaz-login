import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import { methods as authentication } from './controllers/authentication.controllers.js';
import { methods as authorization } from './middlewares/authorization.js';

//Server
const app = express();
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//Configuración de archivos estáticos
app.use(express.static(__dirname +  '/public'));
app.use(express.json());
app.use(cookieParser());

//Rutas
app.get('/', authorization.soloPublico, (req, res) => {res.sendFile(__dirname + '/pages/login.html');});
app.get('/register', authorization.soloPublico, (req, res) => {res.sendFile(__dirname + '/pages/register.html');});
app.get('/admin', authorization.soloAdmin, (req, res) => {res.sendFile(__dirname + '/pages/admin/admin.html');});
app.post('/api/register', authentication.register);
app.post('/api/login', authentication.login);