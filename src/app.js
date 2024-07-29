require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const routes = require('./routes/index');

const app = express();

// Middleware para parsear el cuerpo de las solicitudes::::::::::::::::::::
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware para habilitar CORS ::::::::::::::::::::::::::::::::::::::::
app.use(cors());

// Configurar sesiones ::::::::::::::::::::::::::::::::::::::::::::::::::
app.use(session({
    secret: 'Flam822', // Cambia esto por un valor seguro
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Debe ser true en producción si usas HTTPS
}));


// Middleware para servir archivos estáticos::::::::::::::::::::::::::::::
app.use(express.static(path.join(__dirname, '../public')));


// Importa el archivo batch para que se ejecute al iniciar la aplicación:::::
// require('../public/js/batch.js'); // para enviar correos....

// Conexión a la base de datos::::::::::::::::::::::::::::::::::::::::::::::
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

// Inserción de registros en MySQL opcion 2 :::::::::::::::::::::::::::::::::::::
app.post('/insertar2', (req, res) => {
    if (!req.session.user){
        return res.status(401).json({ error: 'No estás autenticado' });
    }

    const { capitulo, seccion, maximo, score, porcentaje, respuesta } = req.body;
    const usuario = req.session.user.username; // Obtener el usuario de la sesión
    const CUIT = req.session.user.CUIT;

    if (!usuario) {
        return res.status(400).json({ error: 'Usuario no definido en la sesión' });
    }

    const respuestaJSON = JSON.stringify(respuesta);// Convertir el array de respuesta a un string JSON   
    const nuevoResultado = 'INSERT INTO respuestas (CUIT, usuario, capitulo, seccion, maximo, score, porcentaje, respuesta) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const datosAPasar = [CUIT, usuario, capitulo, seccion, maximo, score, porcentaje, respuestaJSON];

    conexion.query(nuevoResultado, datosAPasar, function (error, lista) {
        if (error) {
            if (error.code === 'ER_DUP_ENTRY') {
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

// Grabacion de Parciales  :::::::::::::::::::::::::::::::::::::::::::::::::
app.post('/grabaParciales', (req, res) => {
  if (!req.session.user){
      return res.status(401).json({ error: 'No estás autenticado' });
  }
  const { capitulo, seccion, numero, pregunta, respuesta, parcial} = req.body;
  const usuario = req.session.user.username; // Obtener el usuario de la sesión
  const CUIT = req.session.user.CUIT;

  if (!usuario) {
      return res.status(400).json({ error: 'Usuario no definido en la sesión' });
  }

  const respuestaJSON = JSON.stringify(respuesta);   // Convertir el array de respuesta a un string JSON  
  const nuevoParcial = 'INSERT INTO parciales (CUIT, usuario, capitulo, seccion, numero, pregunta, respuesta, parcial) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  const datosAPasar = [CUIT, usuario, capitulo, seccion, numero, pregunta, respuestaJSON, parcial];

  conexion.query(nuevoParcial, datosAPasar, function (error, lista) {
      if (error) {
          if (error.code === 'ER_DUP_ENTRY') {
              res.status(409).json({ error: 'Ya existe una respuesta para esta combinación de capitulo y seccion' });
          } else {
          console.log('Error:', error);
          res.status(500).json({ error: error.message });
      }
      } else {
          res.status(200).json({ success: true });
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


// Endpoint para validar credenciales :::::::::::::::::::::::::::::::::::::::::::::::::::
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // Verificar las credenciales del usuario
    conexion.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
        if (err) {
            res.status(500).send('Error en la base de datos');
        } else if (results.length > 0) {
            const user = results[0]; // Accede a la primera fila de los resultados
            req.session.user = {
               username: user.username,
               firstName: user.Nombre, 
               lastName: user.Apellido, 
               CUIT: user.CUIT}; // Guarda el usuario como un objeto en la sesión
            // res.status(200).send('Login exitoso');
            res.status(200).json({
              message: 'Login exitoso',
              user: {
                firstName: user.Nombre,
                lastName: user.Apellido,
                CUIT: user.CUIT,
                ingresado: user.ingresado } }); 
        } else {
            res.status(401).send('Credenciales inválidas');
        }
    });
});

/*Explicación:
Inicio de sesión: Envía solicitud de inicio de sesión al backend con las credenciales del usuario.
Respuesta del servidor: El servidor responde con un objeto JSON que contiene un mensaje y un objeto user que incluye firstName, lastName y CUIT.
Acceso a CUIT: En el frontend, puedes acceder a CUIT utilizando user.CUIT una vez que hayas recibido y procesado la respuesta.
De esta manera, puedes utilizar el CUIT en cualquier parte del frontend después de que el usuario haya iniciado sesión correctamente. Si necesitas mantener el estado de inicio de sesión y los datos del usuario entre diferentes páginas o sesiones, podrías considerar almacenar esta información en localStorage, sessionStorage, o en el estado de tu aplicación si estás usando una librería como React, Vue, etc.

*/


// Ruta para actualizar el campo "ingresado" del usuario:::::::::::::::::::::::::::::::
app.post('/api/updateIngresado', (req, res) => {
  const { usuario, CUIT } = req.body;
  const query = 'UPDATE users SET ingresado = 1 WHERE username = ? AND CUIT = ?';

  conexion.query(query, [username, CUIT], (error, results) => {
    if (error) {
      console.error('Error al actualizar el campo ingresado:', error);
      res.status(500).json({ error: 'Error al actualizar el campo ingresado' });
      return;
    }
    res.json({ message: 'Campo ingresado actualizado correctamente' });
  });
});


// Ruta protegida que requiere autenticación :::::::::::::::::::::::::::::::::::::::::.
app.get('/protected', (req, res) => {
    if (req.session.user) {
        res.status(200).send(`Bienvenido ${req.session.user.username}`);
    } else {
        res.status(401).send('Necesitas iniciar sesión');
    }
});

// Ruta para obtener todos los registros de la tabla secciones ::::::::::::::::::::
app.get('/secciones', (req, res) => {
    const indice = parseInt(req.query.indice) || 0;
    const query = 'SELECT * FROM secciones WHERE seccion = ?';
  
    conexion.query(query, [indice], (error, results, fields) => {
        if (error) {
          res.status(500).json({ error: 'Error al obtener los registros' });
          console.log("error servidor al obtener registros");
          return;
        }
    
        if (results.length > 0) {  // Verificar si hay al menos un registro
          res.json(results);
        } else {
          res.status(404).json({ error: 'No se encontraron registros' });
        }
      });
    });

// Ruta para obtener los registros de la tabla capitulos ::::::::::::::::::::
app.get('/capitulos', (req, res) => {
    const indice = parseInt(req.query.indice) || 0;
    const query = 'SELECT * FROM capitulos WHERE ID = ?';
  
    conexion.query(query, [indice], (error, results, fields) => {
        if (error) {
          res.status(500).json({ error: 'Error al obtener los registros' });
          console.log("error servidor al obtener registros");
          return;
        }
    
        if (results.length > 0) {
          res.json(results);
        } else {
          res.status(404).json({ error: 'No se encontraron registros' });
        }
      });
    });

// Ruta para obtener los totales de la tabla totalcapitulos ::::::::::::::::::::
app.get('/totalCapitulos', (req, res) => {
    const CUIT = req.query.CUIT;
    const capitulo = req.query.capitulo;

    if (!CUIT || !capitulo) {
        res.status(400).json({ error: 'Faltan parámetros CUIT o capitulo' });
        return;
      }
    const query = 'SELECT * FROM totalcapitulos WHERE CUIT = ? AND capitulo = ?';
  
    conexion.query(query, [CUIT, capitulo], (error, results, fields) => {
        if (error) {
          res.status(500).json({ error: 'Error al obtener los registros' });
          console.log("error servidor al obtener registros");
          return;
        }
        if (results.length > 0) {
          res.json(results);
        } else {
          res.status(404).json({ error: 'No se encontraron registros' });
        }
      });
    });

// Ruta para obtener toda la lista de precios ::::::::::::::::::::
app.get('/leeListaPrecios', (req, res) => {
  const query = 'SELECT * FROM listaprecios';

  conexion.query(query, (error, results, fields) => {
    if (error) {
      res.status(500).json({ error: 'Error al obtener los registros' });
      return;
    }
    res.json(results);
  });
});

// Ruta para obtener todos las respuestas de la tabla ::::::::::::::::::::
app.get('/respuestas', (req, res) => {
    const query = 'SELECT * FROM respuestas';
  
    conexion.query(query, (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: 'Error al obtener los registros' });
        return;
      }
      res.json(results);
    });
  });

// Ruta para obtener todos las preguntas de la tabla ::::::::::::::::::::
app.get('/preguntas', (req, res) => {
  const query = 'SELECT * FROM preguntas ORDER BY Capitulo, Seccion, Numero';

  conexion.query(query, (error, results, fields) => {
    if (error) {
      res.status(500).json({ error: 'Error al obtener los registros' });
      return;
    }
    res.json(results);
  });
});

// Ruta para saber si existe respuesta para la seccion ::::::::::::::::::::
app.get('/busca-respuesta', (req, res) => {
    const { CUIT, capitulo, seccion } = req.query;

    if (!CUIT || !capitulo || !seccion) {
        res.status(400).json({ error: 'Faltan parámetros requeridos' });
        console.log (`valores CUIT ${CUIT}, capitulo ${capitulo}, seccion ${seccion}`)
        console.log (`salio en error por aca`)
        return;
      }
    const query = 'SELECT * FROM respuestas WHERE cuit = ? AND capitulo = ? AND seccion = ?';
    const values = [CUIT, capitulo, seccion];

    conexion.query(query, values, (error, results, fields) => {
        if (error) {
            console.log ('primer error en el query')
          res.status(500).json({ error: 'Error al buscar el registro' });
          return;
        }

        if (results.length > 0) {
            res.json({ exists: true, record: results[0] });  //devuelve registro completo
          } else {
            console.log (`no hay respuesta para seccion ${seccion} en busca-respuesta`)
            res.json({ exists: false });
          }
        });
      });

// Ruta para buscar respuestas por cuit y capitulo.:::::::::::::::::::
app.get('/busca-respuesta-capitulo', (req, res) => {
  const { CUIT, capitulo } = req.query;

  if (!CUIT || !capitulo) {
      res.status(400).json({ error: 'Faltan parámetros requeridos' });
      console.log (`valores CUIT ${CUIT}, capitulo ${capitulo}`)
      console.log (`salio en error por aca`)
      return;
    }
  const query = 'SELECT * FROM respuestas WHERE cuit = ? AND capitulo = ?';
  const values = [CUIT, capitulo];

  conexion.query(query, values, (error, results, fields) => {
      if (error) {
        console.log ('primer error en el query')
        res.status(500).json({ error: 'Error al buscar el registro' });
        return;
      }
      if (results.length > 0) {
        res.json({ exists: true, records: results});
      } else {
        console.log (`no hay respuesta para CUIT ${CUIT} y capitulo ${capitulo} en busca-respuesta-capitulo`)
        res.json({ exists: false });
        }
      });
    });

// Ruta para actualizar la tabla capitulos con los totales.:::::::::::::::::::
app.post('/total-Capitulo', (req, res) => {
    if (!req.session.user){
        return res.status(401).json({ error: 'No estás autenticado' });
    }

    const { capitulo, maximo, score, porcentaje } = req.body;
    const usuario = req.session.user.username; // Obtener el usuario de la sesión
    const CUIT = req.session.user.CUIT; // Obtiene el cuit

    if (!usuario) {
        return res.status(400).json({ error: 'Usuario no definido en la sesión' });
    }

    const nuevoTotal = 'INSERT INTO totalcapitulos (CUIT, capitulo, maximo, score, porcentaje) VALUES (?, ?, ?, ?, ?)';
    const datosAPasar = [CUIT, capitulo, maximo, score, porcentaje];

    conexion.query(nuevoTotal, datosAPasar, function (error, lista) {
        if (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                console.log('Ya existe una respuesta para esta combinación de CUIT y Capitulo - sigue normal');                // Manejar el error de duplicación
            } else {
            console.log('Error:', error);
            res.status(500).json({ error: error.message });
        }
        } else {
            // console.log(lista.insertId, lista.fieldCount);
            res.status(200).json({ success: true });
        }
    });
});

// Ruta para obtener todos las respuestas de la tabla textorespuestas::::::::::::::::::::
app.get('/textorespuestas', (req, res) => {
  const query = 'SELECT * FROM textorespuestas';

  conexion.query(query, (error, results, fields) => {
    if (error) {
      res.status(500).json({ error: 'Error al obtener los registros' });
      return;
    }
    res.json(results);
  });
});

// Ruta para obtener todos las respuestas de la tabla textocheck::::::::::::::::::::
app.get('/textocheck', (req, res) => {
  const query = 'SELECT * FROM textocheck';

  conexion.query(query, (error, results, fields) => {
    if (error) {
      res.status(500).json({ error: 'Error al obtener los registros' });
      return;
    }
    res.json(results);
  });
});
  
// Captura todas las otras rutas para mostrar un 404 :::::::::::::::::::::::::::::::::
app.get('*', (req, res) => {
    res.status(404).send('Page Not Found');
});

const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});


