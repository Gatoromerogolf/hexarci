require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
// const morgan = require('morgan');
const path = require('path');
// const expressLayouts = require('express-ejs-layouts');


const routes = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 3000;

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


// // Función de handler para una función serverless (ejemplo)
// exports.handler = async (event, context) => {
//   console.log('Handler iniciado');
//   return new Promise((resolve, reject) => {
//     console.log('Ejecutando consulta a la base de datos...');
//     db.query('SELECT * FROM capitulos', (error, results) => {
//       if (error) {
//         console.error('Error al ejecutar la consulta:', error);
//         return reject({
//           statusCode: 500,
//           body: JSON.stringify(error)
//         });
//       }

//       // Imprimir resultados a la consola
//       console.log('Resultados de la consulta:', results);

//       resolve({
//         statusCode: 200,
//         body: JSON.stringify(results),
//       });
//     });
//   });
// };


// Middleware para parsear el cuerpo de las solicitudes:::::::::::::::
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware para habilitar CORS y logging::::::::::::::::::::::
app.use(cors());
// app.use(morgan('dev'));


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


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
