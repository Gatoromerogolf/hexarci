require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const routes = require('./routes/index');

const app = express();

// Middleware para parsear el cuerpo de las solicitudes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware para habilitar CORS
app.use(cors());

// Configurar sesiones
app.use(session({
    secret: 'Flam822', // Cambia esto por un valor seguro
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Debe ser true en producción si usas HTTPS
}));


// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// Conexión a la base de datos
const conexion = mysql.createConnection({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

conexion.connect(function (err) {
    if (err) {
        console.log('No se pudo conectar:', err);
        throw err;
    } else {
        console.log('Conexión exitosa a la base hexarci');
    }
});

// Inserción de registros en MySQL
app.post('/insertar', (req, res) => {
    if (!req.session.user){
        return res.status(401).json({ error: 'No estás autenticado' });
    }

    const { cuit, capitulo, datos } = req.body;
    const usuario = req.session.user.username; // Obtener el usuario de la sesión

    const nuevoResultado = 'INSERT INTO a15 (clave, cuit, usuario, capitulo, datos) VALUES (NULL, ?, ?, ?, ?)';
    const datosAPasar = [cuit, usuario, capitulo, datos];

    conexion.query(nuevoResultado, datosAPasar, function (error, lista) {
        if (error) {
            console.log('Error:', error);
            res.status(500).json({ error: error.message });
        } else {
            console.log(lista.insertId, lista.fieldCount);
            res.status(200).json({ success: true });
        }
    });
});

// Inserción de registros en MySQL opcion 2
app.post('/insertar2', (req, res) => {
    if (!req.session.user){
        return res.status(401).json({ error: 'No estás autenticado' });
    }

    const { CUIT, perfil, capitulo, seccion, numero, respuesta } = req.body;
    const usuario = req.session.user.username; // Obtener el usuario de la sesión

    // Convertir el array de respuesta a un string JSON
    const respuestaJSON = JSON.stringify(respuesta);   

    console.log('Datos recibidos:', { CUIT, usuario, perfil, capitulo, seccion, numero, respuesta });

    const nuevoResultado = 'INSERT INTO respuestas (CUIT, usuario, perfil, capitulo, seccion, numero, respuesta) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const datosAPasar = [CUIT, usuario, perfil, capitulo, seccion, numero, respuestaJSON];

    conexion.query(nuevoResultado, datosAPasar, function (error, lista) {
        if (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                // Manejar el error de duplicación
                res.status(409).json({ error: 'Ya existe una respuesta para esta combinación de capitulo y seccion' });
            } else {
            console.log('Error:', error);
            res.status(500).json({ error: error.message });
        }
        } else {
            console.log(lista.insertId, lista.fieldCount);
            res.status(200).json({ success: true });
        }
    });
});

//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//  PARA RECUPERAR DATOS JSON DE MYSQL

app.get('/obtenerRespuestas', (req, res) => {
    const consulta = 'SELECT * FROM respuestas WHERE id = ?';
    const id = req.query.id; // Asumiendo que el ID es pasado como parámetro de consulta

    conexion.query(consulta, [id], function (error, resultados) {
        if (error) {
            console.log('Error:', error);
            res.status(500).json({ error: error.message });
        } else {
            if (resultados.length > 0) {
                const resultado = resultados[0];
                // Parsear el campo respuesta de JSON a un objeto o array
                resultado.respuesta = JSON.parse(resultado.respuesta);
                res.status(200).json(resultado);
            } else {
                res.status(404).json({ error: 'Registro no encontrado' });
            }
        }
    });
});

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

// Rutas de la API
app.use('/api', routes);

// Ruta para servir index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Ruta para servir el archivo login.html
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

// Endpoint para validar credenciales
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // Verificar las credenciales del usuario
    conexion.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
        if (err) {
            res.status(500).send('Error en la base de datos');
        } else if (results.length > 0) {
            const user = results[0]; // Accede a la primera fila de los resultados
            req.session.user = username; // Guarda el usuario en la sesión
            // res.status(200).send('Login exitoso');
            res.status(200).json({ message: 'Login exitoso', user: { firstName: user.Nombre, lastName: user.Apellido } }); 
        } else {
            res.status(401).send('Credenciales inválidas');
        }
    });
});

// Ruta protegida que requiere autenticación
app.get('/protected', (req, res) => {
    if (req.session.user) {
        res.status(200).send(`Bienvenido ${req.session.user.username}`);
    } else {
        res.status(401).send('Necesitas iniciar sesión');
    }
});

// Captura todas las otras rutas para mostrar un 404
app.get('*', (req, res) => {
    res.status(404).send('Page Not Found');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
