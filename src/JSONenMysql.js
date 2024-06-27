/*Tengo que guardar en mysql los resultados del procesamiento de varios formularios de encuesta.
La encuesta tiene varias preguntas.
Creo que me conviene guardar los resultados en un arreglo.
Algunas posiciones de ese arreglo tendrán como valor un numero y otros un arreglo de numeros (ejemplo, una pregunta de tipo checklist y hay que guardar los casilleros seleccionados).
Otros datos a guardar son el nombre del usuario que contestó y el número de formulario al que corresponde la encuesta.
Cómo me conviene definir los datos en mysql?
Debo utilizar JSON?*/

/*Para almacenar los resultados de una encuesta que incluyen tanto valores numéricos simples como arreglos de números, es una buena idea utilizar el tipo de datos JSON en MySQL. Este enfoque te permite almacenar estructuras de datos complejas y acceder a ellas de manera flexible.

Aquí te dejo una estructura sugerida para tu base de datos y algunos ejemplos de cómo manejar estos datos en tu aplicación.

Definir la estructura de la tabla en MySQL
Puedes definir una tabla para almacenar los resultados de la encuesta de la siguiente manera:*/

/*
CREATE TABLE resultados_encuesta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(255) NOT NULL,
    formulario INT NOT NULL,
    respuestas JSON NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
*/

/*
id: Identificador único para cada registro.
usuario: Nombre del usuario que respondió la encuesta.
formulario: Número del formulario de la encuesta.
respuestas: Campo JSON para almacenar las respuestas.
fecha: Marca de tiempo para registrar cuándo se realizó la encuesta.

Ejemplo de un objeto JSON para almacenar respuestas
Un objeto JSON para almacenar las respuestas podría tener este formato:*/

{
    "pregunta1": 5,
    "pregunta2": [1, 3, 4],
    "pregunta3": 2,
    "pregunta4": [2, 5]
}

/*
Guardar las respuestas en MySQL desde tu aplicación
Aquí tienes un ejemplo de cómo modificar tu código del lado del servidor para insertar estos datos en la base de datos:
*/

/*
app.js
Asegúrate de tener la conexión y las rutas configuradas correctamente:
*/

require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
const session = require('express-session');

const app = express();

// Middleware para parsear el cuerpo de las solicitudes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware para habilitar CORS
app.use(cors());

// Configurar sesiones
app.use(session({
    secret: 'tu_secreto', // Cambia esto por un valor seguro
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Debe ser true en producción si usas HTTPS
}));

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
    if (!req.session.user) {
        return res.status(401).json({ error: 'No estás autenticado' });
    }

    const { formulario, respuestas } = req.body;
    const usuario = req.session.user.username; // Obtener el usuario de la sesión

    const nuevoResultado = 'INSERT INTO resultados_encuesta (usuario, formulario, respuestas) VALUES (?, ?, ?)';
    const datosAPasar = [usuario, formulario, JSON.stringify(respuestas)];

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

// Rutas y otras configuraciones...
app.use(express.static(path.join(__dirname, '../public')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    conexion.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
        if (err) {
            res.status(500).send('Error en la base de datos');
        } else if (results.length > 0) {
            req.session.user = results[0];
            res.status(200).send('Login exitoso');
        } else {
            res.status(401).send('Credenciales inválidas');
        }
    });
});
app.get('*', (req, res) => {
    res.status(404).send('Page Not Found');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

/*
Función para grabar resultados en el cliente
Aquí hay un ejemplo de cómo enviar los datos de las respuestas al servidor desde tu aplicación cliente:
*/

async function grabarResultados(respuestas) {
    alert("entro en grabar resultados");
  
    const formulario = 1; // Puedes obtener este valor dinámicamente
  
    const body = { 
      formulario, 
      respuestas
    };
  
    try {
      const response = await fetch('http://localhost:3000/insertar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
        credentials: 'include' // Esto es importante para incluir las cookies de sesión
      });
  
      const result = await response.json();
      if (result.success) {
        alert("no hay error");
      } else {
        throw new Error(result.error || 'Error desconocido');
      }
    } catch (error) {
      console.log('Error:', error);
      alert("estamos en el error: " + error.message);
      throw error; // Rechaza la promesa en caso de error
    }
  }
  
 /*
 Resumen de lo anotado
Estructura de la tabla: Usa un campo JSON para almacenar las respuestas de la encuesta.
Inserción en la base de datos: Asegúrate de convertir las respuestas en una cadena JSON antes de insertarlas.
Recuperación de usuario: Utiliza la sesión para mantener el nombre del usuario autenticado y úsalo al insertar datos.
Este enfoque te permitirá manejar respuestas de encuestas de manera flexible y eficiente.
*/ 