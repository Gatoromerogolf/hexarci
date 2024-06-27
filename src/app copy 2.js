require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
// const expressLayouts = require('express-ejs-layouts');
// const morgan = require('morgan');
const routes = require('./routes/index');

const app = express();

//conexion a la base de datos::::::::::::::::::::::::::::::::::
const conexion = mysql.createConnection({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  });

conexion.connect(function (err) {
if (err) {
    throw err;
    console.log(`no se pudo conectar`)
} else {
    console.log('conexion exitosa a la base hexarci')
}
})

//  Inserción de registros en MySQL :::::::::::::::::::::::::::::::::

app.post('/insertar', (req, res) => {
  const { cuit, usuario, capitulo, datos } = req.body;

  // // Convertir datos y puntaje a JSON
  // const datosJSON = JSON.stringify(datos);
  // const puntajeJSON = JSON.stringify(puntaje);
  
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


// Middleware para parsear el cuerpo de las solicitudes:::::::::::::::
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware para habilitar CORS:::::::::::::::::::::::::::::::::::
app.use(cors());

// Middleware para servir archivos estáticos:::::::::::::::
app.use(express.static(path.join(__dirname, '../public')));

// Rutas de la API :::::::::::::::::::::::::::::::::::::::::::::::
// app.use('/api', require('./src/routes'));
app.use('/api', routes)

// Ruta para servir index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Ruta para servir el archivo login.html::::::::::::::::::::::
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});


// Endpoint para validar credenciales::::::::::::::::::::::
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  // Valida las credenciales en la base de datos
  conexion.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
      if (err) {
          res.status(500).send('Error en la base de datos');
      } else if (results.length > 0) {
          res.status(200).send('Login exitoso');
      } else {
          res.status(401).send('Credenciales inválidas');
      }
  });
});

// Captura todas las otras rutas para mostrar un 404 o redirigir
app.get('*', (req, res) => {
  res.status(404).send('Page Not Found');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
