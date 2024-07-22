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

    // console.log ("llego y paso el req session")

    const { capitulo, seccion, maximo, score, porcentaje, respuesta } = req.body;
    const usuario = req.session.user.username; // Obtener el usuario de la sesión
    const CUIT = req.session.user.CUIT;

    if (!usuario) {
        return res.status(400).json({ error: 'Usuario no definido en la sesión' });
    }

    // Convertir el array de respuesta a un string JSON
    const respuestaJSON = JSON.stringify(respuesta);   

    console.log('Datos recibidos:', { CUIT, usuario, capitulo, seccion, maximo, score, porcentaje, respuestaJSON });

    const nuevoResultado = 'INSERT INTO respuestas (CUIT, usuario, capitulo, seccion, maximo, score, porcentaje, respuesta) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const datosAPasar = [CUIT, usuario, capitulo, seccion, maximo, score, porcentaje, respuestaJSON];

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
            req.session.user = { username: user.username, firstName: user.Nombre, lastName: user.Apellido , CUIT: user.CUIT}; // Guarda el usuario como un objeto en la sesión
            // res.status(200).send('Login exitoso');
            res.status(200).json({ message: 'Login exitoso', user: { firstName: user.Nombre, lastName: user.Apellido, CUIT: user.CUIT, ingresado: user.ingresado } }); 
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
  const { username, CUIT } = req.body;
  const query = 'UPDATE usuarios SET ingresado = 1 WHERE username = ?, CUIT = ?';

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
    // obtiene el indice de la consulta
    const indice = parseInt(req.query.indice) || 0;
    // console.log (`el indice leido en /secciones:  ${indice}`)
    const query = 'SELECT * FROM secciones WHERE seccion = ?';
  
    conexion.query(query, [indice], (error, results, fields) => {
        if (error) {
          res.status(500).json({ error: 'Error al obtener los registros' });
          console.log("error servidor al obtener registros");
          return;
        }
    
        // Verificar si hay al menos un registro
        if (results.length > 0) {
          res.json(results);
        } else {
          res.status(404).json({ error: 'No se encontraron registros' });
        }
      });
    });


// Ruta para obtener los registros de la tabla capitulos ::::::::::::::::::::
app.get('/capitulos', (req, res) => {
    // obtiene el indice de la consulta
    const indice = parseInt(req.query.indice) || 0;
    // console.log (`el indice leido en /secciones:  ${indice}`)
    const query = 'SELECT * FROM capitulos WHERE ID = ?';
  
    conexion.query(query, [indice], (error, results, fields) => {
        if (error) {
          res.status(500).json({ error: 'Error al obtener los registros' });
          console.log("error servidor al obtener registros");
          return;
        }
    
        // Verificar si hay al menos un registro
        if (results.length > 0) {
          res.json(results);
        } else {
          res.status(404).json({ error: 'No se encontraron registros' });
        }
      });
    });

// Ruta para obtener los totales de la tabla totalcapitulos ::::::::::::::::::::
app.get('/totalCapitulos', (req, res) => {
    // obtiene el indice de la consulta
    const CUIT = req.query.CUIT;
    const capitulo = req.query.capitulo;

    if (!CUIT || !capitulo) {
        res.status(400).json({ error: 'Faltan parámetros CUIT o capitulo' });
        return;
      }

    // console.log(`Recibido CUIT: ${CUIT}, capitulo: ${capitulo}`);

    const query = 'SELECT * FROM totalcapitulos WHERE CUIT = ? AND capitulo = ?';
  
    conexion.query(query, [CUIT, capitulo], (error, results, fields) => {
        if (error) {
          res.status(500).json({ error: 'Error al obtener los registros' });
          console.log("error servidor al obtener registros");
          return;
        }
        // console.log('Resultados de la consulta:', results);
        
        // Verificar si hay al menos un registro
        if (results.length > 0) {
          res.json(results);
        } else {
          res.status(404).json({ error: 'No se encontraron registros' });
        }
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
  const query = 'SELECT * FROM preguntas';

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
    // console.log(`valores que busca: ${values}`)

    conexion.query(query, values, (error, results, fields) => {
        if (error) {
            console.log ('primer error en el query')
          res.status(500).json({ error: 'Error al buscar el registro' });
          return;
        }

        if (results.length > 0) {
            // console.log (`encontro respuesta para seccion ${seccion}`)
            res.json({ exists: true, score: results[0].score });
          } else {
            // console.log (`no hay respuesta para seccion ${seccion} en busca-respuesta`)
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
        // console.log('Resultados encontrados busca-respuesta-capitulo - despues json:', results);
      } else {
        // console.log (`no hay respuesta para CUIT ${CUIT} y capitulo ${capitulo} en busca-respuesta-capitulo`)
        res.json({ exists: false });
        }
      });
    });


// Ruta para actualizar la tabla capitulos con los totales.:::::::::::::::::::

// Inserción de registros en MySQL opcion 2 :::::::::::::::::::::::::::::::::::::
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
            console.log(lista.insertId, lista.fieldCount);
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
    console.log ('lectura tabla texto:' , results )
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

// app.get('/obtenerRespuestas', (req, res) => {
//     const consulta = 'SELECT * FROM respuestas WHERE id = 5';

//     conexion.query(consulta, function (error, resultados) {
//         if (error) {
//             console.log('Error:', error);
//             res.status(500).json({ error: error.message });
//         } else {

//         const respuesta = respuestas.find(
//         (respuesta) => respuesta.cuit === cuit && respuesta.capitulo === capitulo && respuesta.seccion === seccion
//         );

//         if (respuesta) {
//             res.json({ existe: true, score: respuesta.score});
//         } else {
//             res.json({ existe: false });
//         }
//   )});

/*
Backend:

En la ruta /validar-respuesta, usamos find en lugar de some para encontrar el registro específico que coincida con cuit, capitulo, y seccion.
Si se encuentra el registro, devolvemos un JSON con { existe: true, score: respuesta.score }.
Si no se encuentra, devolvemos { existe: false }.*/

  
// Captura todas las otras rutas para mostrar un 404 :::::::::::::::::::::::::::::::::
app.get('*', (req, res) => {
    res.status(404).send('Page Not Found');
});

const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});


